import dayjs from "dayjs";
import fs from "node:fs";
import { createInterface } from "node:readline";

// 日志格式示例：
// [2026-02-11 10:00:00] [INFO] 获取到电费信息：12.34|5678.9|2026/2/11 09:50:00|成功
export const LOG_LINE_REGEX = /^\[(.+?)\]\s+\[INFO\]\s+获取到电费信息：(.+)$/;

/**
 * 解析单行日志
 * @param {string} line
 * @returns {{
 *   time: string;
 *   balance: number;
 *   total: number;
 *   lastCommunicationTime: string;
 *   lastCommunicationStatus: string;
 * } | null}
 */
export function parseLogLine(line) {
  const match = line.match(LOG_LINE_REGEX);
  if (!match) return null;

  const [, time, info] = match;
  const [balanceStr, totalStr, lastCommunicationTime, lastCommunicationStatus] =
    info.split("|");

  const balance = Number(balanceStr);
  const total = Number(totalStr);

  return {
    balance: balance,
    total: total,
    lastCommunicationTime: dayjs(lastCommunicationTime || time).format(
      "YYYY-MM-DD HH:mm:ss",
    ),
    lastCommunicationStatus: lastCommunicationStatus.trim(),
  };
}

/**
 * 解析整个日志文件
 * @param {string} logFile 日志文件路径
 * @returns {Promise<Array<ReturnType<typeof parseLogLine>>>}
 */
export async function parseLogFile(logFile) {
  if (!fs.existsSync(logFile)) {
    throw new Error(`日志文件不存在，请确认路径: ${logFile}`);
  }

  const stream = fs.createReadStream(logFile, { encoding: "utf8" });
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const records = [];

  for await (const line of rl) {
    const record = parseLogLine(line);
    if (!record || record.lastCommunicationStatus !== "成功") continue;
    delete record.lastCommunicationStatus;
    records.push(record);
  }

  // 按时间排序（保险起见）
  records.sort((a, b) => {
    dayjs(a.lastCommunicationTime).diff(dayjs(b.lastCommunicationTime));
  });

  // 去重
  const seen = new Set();
  const uniqueRecords = [];
  for (const record of records) {
    const key = record.lastCommunicationTime;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueRecords.push(record);
  }

  return uniqueRecords;
}
