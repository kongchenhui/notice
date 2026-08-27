# 荷玛诗国际花园用电充值系统监控（notice）

荷玛诗国际花园用电充值系统 v2.0 监控看板：定时抓取电表余额与用电数据，余额低于阈值时自动发送邮件预警，前端实时展示余额趋势、用电统计与通知历史。

## 功能特性

- **定时抓取**：按 cron 定时从电表门户抓取剩余电量、电表读数、通讯时间与状态（`src/services/fetcher.js`）
- **余额预警**：余额低于阈值时发送邮件通知，支持通知间隔 / 时段限制（`NOTICE_*` 环境变量）
- **数据存储**：SQLite（better-sqlite3），唯一索引 + 应用层去重
- **前端看板**：Vue 3 + Vite + ECharts 像素风仪表盘（余额趋势 / 电表读数 / 每小时用电量 / 明细与通知历史）
- **中英双语**：vue-i18n，页头一键切换，默认跟随浏览器语言，选择持久化到 localStorage
- **三档主题**：亮色 / 暗色 / 跟随系统，持久化到 localStorage，图表随主题同步换色
- **实时刷新**：每 60 秒自动拉取最新数据，支持手动刷新

## 技术栈

| 端 | 技术 |
| --- | --- |
| 后端 | Node.js + Express 5、better-sqlite3、node-schedule、nodemailer |
| 前端 | Vue 3 + Vite、ECharts、dayjs、vue-i18n |
| 构建 | pnpm（前后端分离，根目录 `npm` 统管） |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

| 变量 | 说明 |
| --- | --- |
| `PORT` | 服务端口（默认 `30000`） |
| `DB_PATH` | SQLite 数据库文件路径 |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | 发件邮箱（示例为 QQ 邮箱） |
| `EMAIL_FROM` / `EMAIL_TO` | 发件人 / 收件人地址 |
| `NOTICE_THRESHOLD` | 余额预警阈值（度） |
| `NOTICE_INTERVAL_HOURS` / `NOTICE_START_HOUR` / `NOTICE_END_HOUR` | 预警间隔与每日时段限制 |

### 3. 启动

```bash
npm run dev     # 开发：后端 + 前端 Vite 热更新
npm run build   # 构建前端到 dist/
npm run start   # 生产：单服务托管 API + 静态前端
```

## 目录结构

```
index.js                # 服务入口（Express + 静态托管 + 定时任务）
src/
  config.js             # 环境变量配置
  logger.js             # 日志
  db/                   # SQLite 连接与建表
  services/             # fetcher（抓取）、scheduler（定时）、notifier + email（邮件预警）
  routes/               # API 路由（/api/data、/api/stats、/api/notices）
frontend/
  src/
    App.vue             # 页面骨架（页头、统计、图表、明细/通知 Tab）
    components/         # DashboardHeader / StatsGrid / 图表 / RecordsTable / NoticeHistory
    composables/        # useApi / useTheme / useChartTheme
    i18n/               # vue-i18n 语言包（zh-CN / en-US）
    styles/main.css     # 全局样式（星露谷田园像素风）
docs/                   # 设计文档（game-pixel-style.md 为 UI 规范唯一事实来源）
data/                   # SQLite 数据文件（不入库）
```

## 相关文档

- [AGENT.md](AGENT.md) — 项目开发约定（i18n / 主题 / 样式规范摘要）
- [docs/game-pixel-style.md](docs/game-pixel-style.md) — UI 视觉规范（星露谷田园像素风：色板、主题三档、字体、组件、动效与无障碍）
