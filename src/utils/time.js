import dayjs from "dayjs";

/**
 * 将电表通讯时间规范化为补零格式 "YYYY-MM-DD HH:mm:ss"
 *
 * 电表门户返回的格式形如 "2026/8/28 2:02:50"，月/日/时不补零，
 * 直接作为文本存储会导致 SQL 排序按字典序出错（如 10 点排在 2 点前）。
 * 本函数在数据入库前统一规范化：
 * - "2026/8/28 2:02:50"  -> "2026-08-28 02:02:50"
 * - "2026-08-28 02:02:50" -> "2026-08-28 02:02:50"（已是规范格式，保持不变，幂等）
 * - 解析失败（空串、异常文本）-> 原样返回，不破坏数据
 *
 * @param {string|undefined|null} t 原始时间文本
 * @returns {string} 规范化后的时间文本
 */
export function normalizeCommTime(t) {
  if (!t) return t ?? "";
  const s = String(t).trim();
  const d = dayjs(s);
  if (!d.isValid()) return s;
  const normalized = d.format("YYYY-MM-DD HH:mm:ss");
  return normalized === s ? s : normalized;
}
