# AGENT.md — 荷玛诗国际花园用电充值系统（notice）

## 项目概览

荷玛诗国际花园用电充值系统 v2.0：定时抓取电表余额与用电数据，余额低于阈值时通过邮件发送预警通知，前端实时展示余额趋势、用电统计与通知历史。

- 后端：`src/`（Express 5 API、better-sqlite3 存储、node-schedule 定时抓取、nodemailer 邮件）
- 前端：`frontend/`（Vue 3 + Vite + ECharts + vue-i18n）
- 入口：`index.js`；环境变量见 `.env.example`

## 常用命令

```bash
npm run dev      # 并发启动后端 + 前端 Vite（开发）
npm run build    # 构建前端
npm run start    # 生产启动
cd frontend && npm run dev   # 仅前端
```

## 必读文档（UI 唯一事实来源）

- **[docs/game-pixel-style.md](docs/game-pixel-style.md)** —— 游戏像素风（星露谷田园系）UI 视觉规范：
  - 风格定位、设计原则、色板（暗色默认 / 亮色两套，含对比度补充）
  - 亮暗主题切换机制（`data-theme` + CSS 变量 + localStorage 持久化 + 跟随系统，§3.4–§3.5）
  - 字体（Pixelify Sans + 系统中文字体）、布局与响应式（§5 页面骨架/栅格断点/间距）、像素化技术要点、组件规范（卡片/按钮/表格/Tab/状态点/图表）
  - 动效、无障碍、反模式、交付前检查清单

**任何前端界面改动，必须先阅读并遵循该文档。**

## 开发约定

1. **UI 一律遵循 `docs/game-pixel-style.md`**：
   - 颜色只使用文档中定义的 token（组件内禁止写死色值，禁止新增色板外颜色）
   - 尺寸/间距/偏移对齐 4px 像素网格；布局按 §5（HUD 页面骨架、栅格断点、间距节奏）；卡片/按钮/表格/状态点按 §7 组件规范
   - 动效按 §8（快节奏、硬阴影、尊重 `prefers-reduced-motion`）；无障碍按 §9（对比度 ≥4.5:1、可见焦点、不单靠颜色）
2. **主题三档**：使用 `data-theme` + CSS 变量方案（§3.5），三档偏好 `light` / `dark` / `system`（跟随系统），默认 `system`（按 `prefers-color-scheme`，兜底亮色）；选择持久化到 `localStorage`（key `theme`，值为三档之一）。生效主题由 `useTheme()` 的 computed `theme` 提供（`system` 已解析为 light/dark），页面 `<html data-theme>` 与 ECharts 图表配色（§7.7）均随生效主题同步。
3. **前端国际化（i18n）**：使用 `vue-i18n`（composition 模式），支持 `zh-CN`（默认/回退）+ `en-US`；语言切换按钮在页头（`DashboardHeader`），复用按钮样式（§7.2）。文案一律写入 `frontend/src/i18n/locales/{zh-CN,en-US}.js`，组件内通过 `useI18n()` 的 `t()` 取用，禁止硬编码中文；语言初始值 `localStorage(locale)` → `navigator.language` → `zh-CN`，切换调用 `setLocale()`（见 `frontend/src/i18n/index.js`）并持久化。ECharts 图表内的轴名/系列名/单位等文案需 `watch(locale)` 重新 `setOption` 同步。
4. **新增样式元素**（颜色、字体、组件样式）前，先确认是否已在风格文档定义；未定义时先补充文档再实现，保持文档为唯一事实来源。
5. 后端接口与数据层不涉及视觉样式；任何新组件需保证暗色（默认）与亮色主题下均可读。

## 目录结构

```
index.js                # 服务入口
src/                    # 后端：config / logger / db / routes / services
  services/             # fetcher（抓取）、scheduler（定时）、notifier + email（通知）
frontend/
  src/
    App.vue             # 页面骨架（页头、统计、图表、明细/通知 Tab）
    components/         # DashboardHeader / StatsGrid / BalanceChart / TotalChart / HourlyUsageChart / RecordsTable / NoticeHistory
    composables/        # useApi（数据请求）
    i18n/               # vue-i18n 配置与语言包（locales/zh-CN.js、locales/en-US.js）
    styles/main.css     # 全局样式（按风格文档改造）
data/                   # SQLite 数据文件
docs/                   # 设计文档（game-pixel-style.md 为 UI 规范来源）
```
