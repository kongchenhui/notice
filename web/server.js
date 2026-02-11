import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dayjs from "dayjs";
import { parseLogFile } from "./logParser.js";
import { getDefaultLogFile } from "./logPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = getDefaultLogFile();

const PORT = process.env.PORT || 3000;

const app = express();

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

// 静态资源
const publicDir = path.join(__dirname, "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

/**
 * 根据相邻两条记录，计算每条记录对应的“每小时用电量”
 * 公式： (当前电表读数 - 上一次电表读数) / 时间间隔（小时）
 * 约束：时间间隔 <= 3 小时，否则记为 null
 */
function attachHourlyUsage(records) {
  if (!Array.isArray(records) || records.length === 0) return records;

  const result = records.map((r) => ({ ...r, hourlyUsage: null }));

  for (let i = 1; i < result.length; i++) {
    const prev = result[i - 1];
    const cur = result[i];

    if (
      prev.total == null ||
      cur.total == null ||
      Number.isNaN(Number(prev.total)) ||
      Number.isNaN(Number(cur.total))
    ) {
      continue;
    }

    const prevTime = dayjs(prev.lastCommunicationTime);
    const curTime = dayjs(cur.lastCommunicationTime);

    if (!prevTime || !curTime) continue;

    const minutes = curTime.diff(prevTime, "minute");
    const hours = minutes / 60;

    // 间隔异常或超过 3 小时，则不计算
    if (hours <= 0 || hours > 3) continue;

    const diffTotal = Number(cur.total) - Number(prev.total);
    if (diffTotal < 0) continue;

    cur.hourlyUsage = diffTotal / hours;
  }

  return result;
}

// 数据接口：返回解析后的日志数据（已按读取时间去重，并包含每小时用电量）
app.get("/api/data", async (req, res) => {
  try {
    const rawRecords = await parseLogFile(LOG_FILE);
    const enriched = attachHourlyUsage(rawRecords);
    res.json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    console.error("读取/解析日志失败：", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

// 默认首页
app.get("/", (req, res) => {
  const indexHtml = path.join(publicDir, "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.send(
      "<h1>电费监控服务</h1><p>前端页面文件未找到，请检查 web/public/index.html 是否存在。</p>",
    );
  }
});

app.listen(PORT, () => {
  logger.info(`电费监控 Web 服务已启动：http://localhost:${PORT}`);
  logger.info(`使用日志文件：${LOG_FILE}`);
});
