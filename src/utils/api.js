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
 * 获取当前剩余电费
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
      const m = text.match(
        /<td[^>]*>\s*购电剩余\s*<\/td>\s*<td[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/td>/i,
      );
      const m2 = text.match(
        /<td[^>]*>\s*表字\s*<\/td>\s*<td[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/td>/i,
      );
      if (!m || !m2) {
        return reject(new Error(`未找到剩余电费信息：${text}`));
      }

      resolve({ balance: Number(m[1]), total: Number(m2[1]) });
    })
    .catch(reject);
  return promise;
}
