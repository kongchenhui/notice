import { Router } from "express";
import { getDb } from "../db/connection.js";
import { logger } from "../logger.js";

const router = Router();

/**
 * GET /api/data
 * 获取电费记录列表，支持 ?days=N 和 ?limit=N 参数
 */
router.get("/data", (req, res) => {
  try {
    const db = getDb();
    const days = parseInt(req.query.days) || 0;
    const limit = parseInt(req.query.limit) || 0;

    let sql = "SELECT * FROM electricity_records";
    const params = {};

    if (days > 0) {
      sql +=
        " WHERE created_at >= datetime('now', 'localtime', @daysOffset)";
      params.daysOffset = `-${days} days`;
    }

    sql += " ORDER BY last_communication_time ASC";

    if (limit > 0) {
      sql += " LIMIT @limit";
      params.limit = limit;
    }

    const records = db.prepare(sql).all(params);

    res.json({ success: true, data: records });
  } catch (err) {
    logger.error("查询电费数据失败：", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

/**
 * GET /api/notices
 * 获取通知历史记录，按时间倒序
 */
router.get("/notices", (req, res) => {
  try {
    const db = getDb();
    const limit = parseInt(req.query.limit) || 50;

    const notices = db
      .prepare(
        "SELECT * FROM notice_records ORDER BY created_at DESC LIMIT @limit",
      )
      .all({ limit });

    res.json({ success: true, data: notices });
  } catch (err) {
    logger.error("查询通知记录失败：", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

/**
 * GET /api/stats
 * 获取最新状态摘要
 */
router.get("/stats", (req, res) => {
  try {
    const db = getDb();

    // 最新一条电费记录
    const latest = db
      .prepare(
        "SELECT * FROM electricity_records ORDER BY id DESC LIMIT 1",
      )
      .get();

    // 总记录数
    const { total } = db
      .prepare("SELECT COUNT(*) as total FROM electricity_records")
      .get();

    // 最近一次通知时间
    const lastNotice = db
      .prepare(
        "SELECT created_at FROM notice_records WHERE email_sent = 1 ORDER BY id DESC LIMIT 1",
      )
      .get();

    res.json({
      success: true,
      data: {
        latest: latest || null,
        totalRecords: total,
        lastNoticeTime: lastNotice?.created_at || null,
      },
    });
  } catch (err) {
    logger.error("查询统计数据失败：", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
