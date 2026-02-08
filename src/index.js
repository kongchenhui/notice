import dayjs from "dayjs";
import { getBalance } from "./utils/api.js";
import { sendNoticeEmail } from "./utils/email.js";
import schedule from "node-schedule";

const NOTICE_THRESHOLD = 20; // 电费通知阈值

globalThis.logger = {
  info: (...args) =>
    console.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]`, "INFO", ...args),
  error: (...args) =>
    console.error(
      `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]`,
      "ERROR",
      ...args
    ),
};

function run() {
  getBalance().then((data) => {
    logger.info("当前剩余电费:", data);
    if (data < NOTICE_THRESHOLD) {
      logger.info(`电费低于${NOTICE_THRESHOLD}度，发送通知邮件`);
      sendNoticeEmail(data);
    }
  });
}
run();

// node-schedule 每两个小时
schedule.scheduleJob("0 */2 * * *", () => {
  run();
});
