// 用于持久化通知时间戳，支持重启恢复
// 目前简单实现为JSON文件

import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url);

const DATA_FILE = path.resolve(__dirname, "../../notice-timestamp.json");

export function getLastNoticeTime() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return data.lastNoticeTime ? dayjs(data.lastNoticeTime) : null;
    }
  } catch (e) {
    logger.error("读取通知时间失败", e);
  }
  return null;
}

export function setLastNoticeTime(date = new Date()) {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ lastNoticeTime: dayjs().format("YYYY-MM-DD HH:mm:ss") }),
      "utf-8",
    );
  } catch (e) {
    logger.error("写入通知时间失败", e);
  }
}
