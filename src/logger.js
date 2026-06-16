import dayjs from "dayjs";

/**
 * 统一日志工具，带时间戳前缀
 */
export const logger = {
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
