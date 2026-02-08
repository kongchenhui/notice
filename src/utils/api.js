import axios from "axios";
import { log } from "console";

/**
 * 获取当前剩余电费
 */
export async function getBalance() {
  const { promise, resolve, reject } = Promise.withResolvers();
  try {
    const resp = await fetch(
      "http://wuxishengangtiandi.wxjihisea.cn/A0SuZhou/DefaultSuZhou.aspx",
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          "proxy-connection": "keep-alive",
          "upgrade-insecure-requests": "1",
          cookie:
            "ASP.NET_SessionId=nu3xmvz3v0rzzlwf21iu1stp; cxtxt=602; lname=217%23(1); yhid=0243710001; yhname=217%23-602",
          Referer:
            "http://wuxishengangtiandi.wxjihisea.cn/A0SuZhou/DefaultSuZhou.aspx",
        },
        body: "__VIEWSTATE=%2FwEPDwUKLTYxODAyNDk3NQ9kFgICAw9kFgYCAQ8QDxYGHg1EYXRhVGV4dEZpZWxkBQdsb3VOYW1lHg5EYXRhVmFsdWVGaWVsZAUHbG91TmFtZR4LXyFEYXRhQm91bmRnZBAVAwcyMTIjKDUpBzIxNyMoMSkHMjE4IygyKRUDBzIxMiMoNSkHMjE3IygxKQcyMTgjKDIpFCsDA2dnZ2RkAgcPPCsACgEADxYEHwJnHgtfIUl0ZW1Db3VudAIBZBYCZg9kFgZmDw8WAh4HVmlzaWJsZWhkZAIBD2QWAmYPZBYEZg8VCQowMjQzNzEwMDAxCDIxNyMtNjAyCTI1ODQuNjUwMAcyNC43MDAwBjAuMDAwMAbpooToraYD6YCaBuaIkOWKnxEyMDI2LzIvOCAxMTowMzowMGQCAQ8PFgIeD0NvbW1hbmRBcmd1bWVudAUUMjE3Iy02MDIoMDI0MzcxMDAwMSlkZAICDw8WAh8EaGRkAgkPPCsAEQMADxYEHwJnHwMCAWQBEBYAFgAWAAwUKwAAFgJmD2QWBgIBD2QWCGYPDxYCHgRUZXh0BQowMjQzNzEwMDAxZGQCAQ8PFgIfBgUHMjE3IygxKWRkAgIPDxYCHwYFCDIxNyMtNjAyZGQCAw9kFgICAQ8PFgIfBQUUMjE3Iy02MDIoMDI0MzcxMDAwMSlkZAICDw8WAh8EaGRkAgMPDxYCHwRoZGQYAgUOeW9uZ2h1R3JpZFZpZXcPPCsADAMGFQEIWW9uZ2h1SUQHFCsAARQrAAEFCjAyNDM3MTAwMDEIAgFkBRB5b25nZGlhbkZvcm1WaWV3DxQrAAdkZGRkZBYAAgFkViIG4K9QuCxLXm1L3yE9%2FUZYMj6rq4yNyYEpyUU0ps8%3D&__VIEWSTATEGENERATOR=F2CA59ED&__EVENTVALIDATION=%2FwEdAAjq2wmMyywZj5of55f9OIBuTb734Y5BpNTZRK8luMdGaZ%2BpE1gEAt7nznFvjW5%2BfX9X3XR%2FkR9o3Z9SBkRZGEuunw9P61zoT0UW5oOQr1cOBd%2B%2FZIS5uOsLQsmAqOOst%2BDPZ8mhrZJCYy%2FDCoUkDLxGh28pJ1XbM2PnxYCjMfKOrxjjenwS6pSyj6%2FYY%2FGB%2Fv357AuT0a2MBD%2BbUk7h4V9F&lou=217%23%281%29&yonghu=602&chaxun=%E6%9F%A5%E8%AF%A2",
        method: "POST",
      }
    );
    const text = (await resp.text()) || "";
    const m = text.match(
      /<td[^>]*>\s*购电剩余\s*<\/td>\s*<td[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/td>/i
    );

    resolve(Number(m?.[1] || 999));
  } catch (error) {
    logger.error("获取电费信息失败:", error);
    reject(error);
  }
  return promise;
}
