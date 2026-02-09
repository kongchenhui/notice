// 用于持久化通知时间戳，支持重启恢复
// 目前简单实现为JSON文件

import fs from "fs";
import path from "path";

const DATA_FILE = path.resolve("./notice-timestamp.json");

export function getLastNoticeTime() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return data.lastNoticeTime ? new Date(data.lastNoticeTime) : null;
    }
  } catch (e) {
    logger.error("读取通知时间失败", e);
  }
  return null;
}

export function setLastNoticeTime(date = new Date()) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ lastNoticeTime: date.toISOString() }), "utf-8");
  } catch (e) {
    logger.error("写入通知时间失败", e);
  }
}
