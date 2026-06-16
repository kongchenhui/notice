/**
 * 集中管理所有环境变量配置，提供默认值和类型转换
 */
export const config = {
  // 服务端口
  port: parseInt(process.env.PORT, 10) || 30000,

  // 运行模式
  isProduction: process.env.NODE_ENV !== "development",

  // 数据库路径
  dbPath: process.env.DB_PATH || "./data/electricity.db",

  // SMTP 邮件配置
  smtp: {
    host: process.env.SMTP_HOST || "smtp.qq.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },

  // 邮件收发人
  email: {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || "",
    to: process.env.EMAIL_TO || "",
  },

  // 通知规则
  notice: {
    threshold: parseFloat(process.env.NOTICE_THRESHOLD) || 20,
    intervalHours: parseInt(process.env.NOTICE_INTERVAL_HOURS, 10) || 6,
    startHour: parseInt(process.env.NOTICE_START_HOUR, 10) || 7,
    endHour: parseInt(process.env.NOTICE_END_HOUR, 10) || 23,
  },
};
