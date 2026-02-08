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
    .then(({ balance, total }) => {
      logger.info("当前剩余电费:", balance);
      logger.info("总电度数:", total);
      if (balance < NOTICE_THRESHOLD) {
        sendNoticeEmail(balance, total);
      }
    })
    .catch(logger.error);
}

// node-schedule 7点到23点每隔2小时执行一次
schedule.scheduleJob("0 7-23/2 * * *", () => {
  run();
});

function runFirstTime() {
  logger.info("程序启动，首次获取电费信息...");
  run();
}

runFirstTime();
