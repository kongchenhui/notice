import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { config } from "./src/config.js";
import { logger } from "./src/logger.js";
import { initDatabase } from "./src/db/connection.js";
import { startScheduler, runOnce } from "./src/services/scheduler.js";
import apiRouter from "./src/routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 初始化数据库（含建表）
initDatabase();

// 2. 创建 Express 应用
const app = express();

// 3. API 路由
app.use("/api", apiRouter);

// 4. 静态文件服务
const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  // SPA 回退：未匹配的非 API 请求返回 index.html
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
  logger.info(`静态文件服务已启用：${distDir}`);
} else {
  logger.info("未找到构建产物目录 dist/，仅提供 API 服务（开发模式下由 Vite 托管前端）");
}

// 5. 启动服务
app.listen(config.port, () => {
  logger.info(`========================================`);
  logger.info(`电费监控系统已启动：http://localhost:${config.port}`);
  logger.info(`API 接口：http://localhost:${config.port}/api/data`);
  logger.info(`运行模式：${config.isProduction ? "生产" : "开发"}`);
  logger.info(`========================================`);
});

// 6. 启动定时任务
startScheduler();
runOnce();
