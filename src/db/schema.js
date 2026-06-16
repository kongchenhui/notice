import { getDb } from "./connection.js";
import { logger } from "../logger.js";

/**
 * 执行数据库迁移（建表），使用 IF NOT EXISTS 保证幂等
 */
export function runMigrations() {
  const db = getDb();

  // 电费记录表：每次成功抓取存储一条
  db.exec(`
    CREATE TABLE IF NOT EXISTS electricity_records (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      balance         REAL    NOT NULL,
      total           REAL    NOT NULL,
      last_communication_time TEXT NOT NULL,
      last_communication_status TEXT NOT NULL,
      hourly_usage    REAL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);

  // 普通索引用于查询
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_records_comm_time
      ON electricity_records(last_communication_time);
  `);

  // 清理历史重复数据：按通讯时间分组，只保留最新一条
  const dupCount = db.prepare(`
    DELETE FROM electricity_records WHERE id NOT IN (
      SELECT MAX(id) FROM electricity_records
      GROUP BY last_communication_time, last_communication_status
    )
  `).run().changes;
  if (dupCount > 0) {
    logger.info(`已清理 ${dupCount} 条重复电费记录`);
  }

  // 唯一索引：防止同一通讯时间重复插入（双重保障）
  try {
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_records_comm_time_unique
        ON electricity_records(last_communication_time, last_communication_status);
    `);
  } catch {
    // 如果索引已存在则忽略
  }

  // 通知记录表：替代 notice-timestamp.json
  db.exec(`
    CREATE TABLE IF NOT EXISTS notice_records (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      balance         REAL    NOT NULL,
      total           REAL    NOT NULL,
      last_communication_time TEXT NOT NULL,
      last_communication_status TEXT NOT NULL,
      email_sent      INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_notices_created
      ON notice_records(created_at);
  `);

  logger.info("数据库迁移完成（表结构已就绪）");
}
