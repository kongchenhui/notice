import os from "node:os";
import path from "node:path";

/**
 * 获取默认的 pm2 日志文件路径
 */
export function getDefaultLogFile() {
  if (process.env.LOG_FILE && process.env.LOG_FILE.trim()) {
    return process.env.LOG_FILE.trim();
  }

  const home =
    process.env.HOME || process.env.USERPROFILE || os.homedir?.() || "";
  if (!home) {
    return "";
  }

  const logsDir = path.join(home, ".pm2", "logs");

  return path.join(logsDir, "balance-out.log");
}
