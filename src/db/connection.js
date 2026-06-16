import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config.js";
import { logger } from "../logger.js";

/** @type {Database.Database | null} */
let db = null;

/**
 * 初始化 SQLite 数据库连接
 * - 自动创建 data 目录
 * - 启用 WAL 模式提升并发性能
 */
export function initDatabase() {
  // 确保 data 目录存在
  const dir = path.dirname(config.dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(config.dbPath);

  // 启用 WAL 模式
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  logger.info(`SQLite 数据库已连接：${config.dbPath}`);
  return db;
}

/**
 * 获取数据库实例（必须先调用 initDatabase）
 * @returns {Database.Database}
 */
export function getDb() {
  if (!db) {
    throw new Error("数据库未初始化，请先调用 initDatabase()");
  }
  return db;
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    logger.info("数据库连接已关闭");
  }
}
