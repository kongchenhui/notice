import dayjs from "dayjs";
import { getBalance } from "./utils/api.js";
import { sendNoticeEmail } from "./utils/email.js";
import schedule from "node-schedule";

const NOTICE_THRESHOLD = 20; // 电费通知阈值

globalThis.logger = {
  info: (...args) =>
    console.log(
      `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]`,
      "[INFO]",
      ...args,
    ),
  error: (...args) =>
    console.error(
      `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]`,
      "[ERROR]",
      ...args,
    ),
};

function run() {
  getBalance()
    .then(
      ({ balance, total, lastCommunicationTime, lastCommunicationStatus }) => {
        const info = [
          balance,
          total,
          lastCommunicationTime,
          lastCommunicationStatus,
        ].join("|");
        logger.info(`获取到电费信息：${info}`);
        if (balance < NOTICE_THRESHOLD) {
          sendNoticeEmail({
            balance,
            total,
            lastCommunicationTime,
            lastCommunicationStatus,
          });
        }
      },
    )
    .catch(logger.error);
}

// node-schedule 7点到23点每隔2小时执行一次
schedule.scheduleJob("15 1-23/2 * * *", () => {
  run();
});

function runFirstTime() {
  logger.info("程序启动，首次获取电费信息...");
  run();
}

runFirstTime();
