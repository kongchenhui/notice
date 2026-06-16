import * as nodemailer from "nodemailer";
import { config } from "../config.js";
import { logger } from "../logger.js";

// 创建邮件传输器（从环境变量读取配置）
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465, // 465端口使用SSL
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/**
 * 发送电费余额预警邮件
 * @param {{ balance: number, total: number, lastCommunicationTime: string, lastCommunicationStatus: string }} data
 * @returns {Promise<boolean>} 发送是否成功
 */
export function sendNoticeEmail({
  balance,
  total,
  lastCommunicationTime,
  lastCommunicationStatus,
}) {
  const mailOptions = {
    from: `"system"<${config.email.from}>`,
    subject: `【余额预警】当前剩余电费: ${balance}度`,
    to: config.email.to,
    html: `
      <p><span style="font-weight: bold;">当前剩余电费为：</span><span style="color: red;">${balance}</span>度</p>
      <p><span style="font-weight: bold;">总电度数为：</span>${total}度</p>
      <p><span style="font-weight: bold;">上次通讯时间：</span>${lastCommunicationTime}</p>
      <p><span style="font-weight: bold;">上次通信状态：</span>${lastCommunicationStatus}</p>
      <p><span style="font-weight: bold;">请及时充值以免断电！</span></p>
      <p><a href="http://wuxishengangtiandi.wxjihisea.cn/A0SuZhou/DefaultSuZhou.aspx">查看详细信息</a></p>
      <p>Send by Balance Notice System</p>
    `,
  };

  // 使用 Promise 包装回调式 API
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("发送邮件失败：", error);
        resolve(false);
      } else {
        logger.info("发送邮件成功：", info.response);
        resolve(true);
      }
    });
  });
}
