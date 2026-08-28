// 荷玛诗湾用电充值系统（电表门户）固定的 POST 表单数据
import { normalizeCommTime } from "../utils/time.js";
const STATIC_BODY_DATA = {
  __VIEWSTATE:
    "/wEPDwUKLTYxODAyNDk3NQ9kFgICAw9kFgYCAQ8QDxYGHg1EYXRhVGV4dEZpZWxkBQdsb3VOYW1lHg5EYXRhVmFsdWVGaWVsZAUHbG91TmFtZR4LXyFEYXRhQm91bmRnZBAVAwcyMTIjKDUpBzIxNyMoMSkHMjE4IygyKRUDBzIxMiMoNSkHMjE3IygxKQcyMTgjKDIpFCsDA2dnZ2RkAgcPPCsACgBkAgkPPCsAEQIBEBYAFgAWAAwUKwAAZBgCBQ55b25naHVHcmlkVmlldw9nZAUQeW9uZ2RpYW5Gb3JtVmlldw9nZOb7IqDk1/Mx+JJCskVC7LnYe8CX+ToJIf+XEQiakunw",
  __VIEWSTATEGENERATOR: "F2CA59ED",
  __EVENTVALIDATION:
    "/wEdAAbguaatJhmb1xbmPw6X/JnfTb734Y5BpNTZRK8luMdGaZ+pE1gEAt7nznFvjW5+fX9X3XR/kR9o3Z9SBkRZGEuunw9P61zoT0UW5oOQr1cOBd+/ZIS5uOsLQsmAqOOst+D9YSOHMWHkZlIlfl1z37OIzuiOlpWqcnxX1Xtoq8+0TA==",
  lou: "217#(1)",
  yonghu: "602",
  chaxun: "查询",
};

/**
 * 从荷玛诗湾用电充值系统获取当前用电信息
 * @returns {Promise<{balance: number, total: number, lastCommunicationTime: string, lastCommunicationStatus: string}>}
 */
export async function getBalance() {
  const { promise, resolve, reject } = Promise.withResolvers();

  fetch("http://wuxishengangtiandi.wxjihisea.cn/A0SuZhou/DefaultSuZhou.aspx", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(STATIC_BODY_DATA).toString(),
    method: "POST",
  })
    .then((resp) => resp.text())
    .then((text) => {
      // 正则匹配：购电剩余
      const m = text.match(
        /<td[^>]*>\s*购电剩余\s*<\/td>\s*<td[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/td>/i,
      );
      // 正则匹配：表字（总电表读数）
      const m2 = text.match(
        /<td[^>]*>\s*表字\s*<\/td>\s*<td[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/td>/i,
      );
      // 正则匹配：上次通讯时间
      const m3 = text.match(
        /<td[^>]*>\s*上次通讯时间\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>/i,
      );
      // 正则匹配：上次通信状态
      const m4 = text.match(
        /<td[^>]*>\s*上次通信状态\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>/i,
      );

      if (!m || !m2) {
        return reject(new Error(`未找到剩余电费信息：${text}`));
      }

      resolve({
        balance: Number(m[1]),
        total: Number(m2[1]),
        // 源头治理：统一规范化为补零格式，保证入库后 SQL 排序/去重可靠
        lastCommunicationTime: normalizeCommTime(m3?.[1]?.trim() || ""),
        lastCommunicationStatus: m4?.[1]?.trim() || "",
      });
    })
    .catch(reject);

  return promise;
}
