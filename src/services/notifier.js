import dayjs from "dayjs";
import { getDb } from "../db/connection.js";
import { config } from "../config.js";
import { logger } from "../logger.js";
import { sendNoticeEmail } from "./email.js";

/**
 * 判断是否应该发送通知，满足条件则发送邮件并记录
 * @param {{ balance: number, total: number, lastCommunicationTime: string, lastCommunicationStatus: string }} record
 */
export async function evaluateAndSend(record) {
  const { balance } = record;

  // 1. 余额不低于阈值，不通知
  if (balance >= config.notice.threshold) {
    return;
  }

  // 2. 不在通知时间窗口内（7-23点），不通知
  const currentHour = dayjs().hour();
  if (
    currentHour < config.notice.startHour ||
    currentHour > config.notice.endHour
  ) {
    return;
  }

  // 3. 距离上次通知不足最小间隔，不通知
  const db = getDb();
  const lastNotice = db
    .prepare(
      "SELECT created_at FROM notice_records WHERE email_sent = 1 ORDER BY created_at DESC LIMIT 1",
    )
    .get();

  if (lastNotice) {
    const hoursSinceLastNotice = dayjs().diff(
      dayjs(lastNotice.created_at),
      "hour",
    );
    if (hoursSinceLastNotice < config.notice.intervalHours) {
      logger.info(
        `距上次通知仅 ${hoursSinceLastNotice} 小时，跳过（最小间隔 ${config.notice.intervalHours} 小时）`,
      );
      return;
    }
  }

  // 4. 发送邮件
  logger.info(`余额 ${balance} 度低于阈值 ${config.notice.threshold}，发送通知邮件...`);
  const success = await sendNoticeEmail(record);

  // 5. 记录通知到数据库
  db.prepare(
    `INSERT INTO notice_records (balance, total, last_communication_time, last_communication_status, email_sent)
     VALUES (@balance, @total, @lastCommunicationTime, @lastCommunicationStatus, @emailSent)`,
  ).run({
    balance: record.balance,
    total: record.total,
    lastCommunicationTime: record.lastCommunicationTime,
    lastCommunicationStatus: record.lastCommunicationStatus,
    emailSent: success ? 1 : 0,
  });

  if (success) {
    logger.info("通知邮件发送成功并已记录");
  } else {
    logger.error("通知邮件发送失败，已记录失败状态");
  }
}
