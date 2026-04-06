import * as nodemailer from "nodemailer";

// nodemailer 配置（保持原有配置）
const config = {
  // 配置服务商提供的发送服务器和端口号
  host: "smtp.qq.com",
  auth: {
    // 发件人邮箱账号
    user: "2604254084@qq.com",
    // 发件人邮箱的授权码（请确保在真实环境中使用安全的方式管理）
    pass: "qtzlqmcnydixdhhj",
  },
};

const transporter = nodemailer.createTransport(config);

/**
 * 发送通知邮件
 * @param {number|string} balance 剩余电度数
 * @param {number|string} total 总电度数
 * @param {string} lastCommunicationTime 上次通讯时间
 * @param {string} lastCommunicationStatus 上次通信状态
 */
export function sendNoticeEmail({
  balance,
  total,
  lastCommunicationTime,
  lastCommunicationStatus,
}) {
  const receiver = {
    from: `"system"<2604254084@qq.com>`,
    subject: `【余额预警】当前剩余电费: ${balance}度`,
    to: "732792684@qq.com",
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

  // 发送邮件
  transporter.sendMail(receiver, (error, info) => {
    if (error) {
      logger.error("发送邮件失败：", error);
    } else {
      logger.info("发送邮件成功：", info.response);
    }
    transporter.close();
  });
}
