import schedule from "node-schedule";
import dayjs from "dayjs";
import { getDb } from "../db/connection.js";
import { logger } from "../logger.js";
import { getBalance } from "./fetcher.js";
import { evaluateAndSend } from "./notifier.js";

/**
 * 计算本次记录的每小时用电量
 * 公式：(当前表字 - 上次表字) / 时间间隔（小时）
 * 约束：时间间隔 <= 3 小时且读数递增，否则为 null
 */
function computeHourlyUsage(record) {
  const db = getDb();
  const prev = db
    .prepare(
      "SELECT total, last_communication_time FROM electricity_records ORDER BY id DESC LIMIT 1",
    )
    .get();

  if (!prev) return null;

  const prevTime = dayjs(prev.last_communication_time);
  const curTime = dayjs(record.lastCommunicationTime);

  if (!prevTime.isValid() || !curTime.isValid()) return null;

  const hours = curTime.diff(prevTime, "minute") / 60;

  // 间隔异常或超过 3 小时，不计算
  if (hours <= 0 || hours > 3) return null;

  const diffTotal = record.total - prev.total;
  if (diffTotal < 0) return null;

  return diffTotal / hours;
}

/**
 * 执行一次电费抓取与存储
 */
async function run() {
  try {
    const data = await getBalance();
    const info = [
      data.balance,
      data.total,
      data.lastCommunicationTime,
      data.lastCommunicationStatus,
    ].join("|");
    logger.info(`获取到电费信息：${info}`);

    const db = getDb();

    // 去重：如果已有相同通讯时间的记录，跳过插入
    const existing = db
      .prepare(
        "SELECT id FROM electricity_records WHERE last_communication_time = @time AND last_communication_status = @status LIMIT 1",
      )
      .get({
        time: data.lastCommunicationTime,
        status: data.lastCommunicationStatus,
      });
    if (existing) {
      logger.info("该通讯时间的数据已存在，跳过重复插入");
      return;
    }

    // 计算每小时用电量
    const hourlyUsage = computeHourlyUsage(data);

    // 存入数据库
    db.prepare(
      `INSERT INTO electricity_records (balance, total, last_communication_time, last_communication_status, hourly_usage)
       VALUES (@balance, @total, @lastCommunicationTime, @lastCommunicationStatus, @hourlyUsage)`,
    ).run({
      balance: data.balance,
      total: data.total,
      lastCommunicationTime: data.lastCommunicationTime,
      lastCommunicationStatus: data.lastCommunicationStatus,
      hourlyUsage: hourlyUsage ?? null,
    });

    // 判断是否需要发送通知
    await evaluateAndSend(data);
  } catch (err) {
    logger.error("电费抓取失败：", err);
  }
}

/**
 * 启动定时任务（每小时第15分钟执行）
 */
export function startScheduler() {
  // node-schedule 5字段 cron：minute hour dayOfMonth month dayOfWeek
  schedule.scheduleJob("15 * * * *", () => {
    run();
  });
  logger.info("定时任务已启动（每小时第15分钟执行）");
}

/**
 * 程序启动时立即执行一次
 */
export function runOnce() {
  logger.info("程序启动，首次获取电费信息...");
  run();
}
