# 游戏像素风（星露谷田园系）UI 视觉规范

> **本文档是项目 UI 视觉风格的唯一事实来源（Single Source of Truth）。**
> 所有前端界面（Vue 组件、样式、图表、动效）的开发与修改必须遵循本文档。
> 与本文档冲突的既有样式，一律以本文档为准。
>
> 适用范围：`frontend/` 下所有页面与组件。
> **亮暗主题：本规范同时定义亮色（默认，星露谷主风格）与暗色（夜间/矿洞变体）两套色板及切换机制（见 §3.4–§3.5）。**
> 生成依据：ui-ux-pro-max 设计系统（Pixel Art 风格）+ Stardew Valley（星露谷物语）田园像素视觉方向。

---

## 1. 风格定位

- **风格**：星露谷田园系像素风（Stardew Valley-like cozy pixel art），16-bit 乡村生活感，暖色手作面板。
- **关键词**：cozy、farm、pastoral、warm、rounded pixel、温馨、田园、自然、手账感。
- **产品语境**：荷玛诗湾用电充值系统监控仪表盘（余额、用电趋势、通知历史）。把"监控面板"包装成"农场账本 / 小镇公告板"，让数据像田园生活一样温暖、安定、易于亲近。
- **感受目标**：温暖、舒适、柔和但保持像素质感——像星露谷的 UI：奶油色面板、木框描边、圆润像素数字，信息清晰但不冰冷。

### 适用 / 不适用

| 适用 | 不适用 |
| --- | --- |
| 卡片、按钮、表格、Tab、徽章、状态点、图表 | 霓虹高饱和、暗黑赛博/街机风（本风格的对立面） |
| 标题、数字、统计数据（"账本"式展示） | 毛玻璃、大范围模糊、冷色荧光 |
| 加载/刷新反馈（温和闪烁光标、像素动画） | emoji 代替图标（必须用 SVG） |

---

## 2. 设计原则

1. **像素网格**：所有尺寸、间距、圆角、偏移量对齐 `4px` 网格（`--pixel-size: 4px`）。避免奇数像素偏移。
2. **柔和边缘**：圆角统一 `2–4px`（星露谷面板的圆角比街机风柔和）；禁止模糊阴影；投影用**暖色硬偏移阴影**（`box-shadow: 4px 4px 0 rgba(90,70,40,0.35)` 式），边缘依旧锐利。
3. **暖色有限色板**：只使用 §3 定义的颜色（奶油、木棕、叶绿、金黄、天空蓝、砖红）。颜色克制，田园感来自配色和谐而非数量。
4. **温和反馈**：交互反馈柔和及时（按下位移 + 阴影收缩，150–250ms），像轻触木桌，不刺眼。
5. **材质暗示**：面板有"纸感/木感"——奶油底 + 木框描边 + 内侧高光线（inset），可叠加极淡点阵纸纹（§6），但不得影响文字对比度。
6. **装饰克制**：像素装饰用于容器与关键元素，不铺满全屏；数据本身保持清晰。

---

## 3. 色彩系统

### 3.1 色板（亮色主题 · 默认，勿新增颜色）

星露谷主风格是明亮田园：奶油米底、木框棕、深暖棕文字，叶绿/金黄/天空蓝做点缀。

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--color-primary` | `#A94438` 砖红 | 主强调、警示、错误底 |
| `--color-on-primary` | `#FFFFFF` | 红底上的文字 |
| `--color-secondary` | `#2F6496` 深天空蓝 | 次要强调、链接、Tab 激活 |
| `--color-on-secondary` | `#FFFFFF` | 蓝底上的文字 |
| `--color-accent` | `#6B9B37` 叶绿 | 成功/在线/健康数据 |
| `--color-on-accent` | `#FFFFFF` | 绿底上的文字 |
| `--color-background` | `#F6EDD9` 暖米 | 页面背景 |
| `--color-foreground` | `#3F3220` 深暖棕 | 主文字（≈10.6:1 ✅） |
| `--color-card` | `#FDF6E3` 奶油 | 卡片/面板背景 |
| `--color-card-foreground` | `#3F3220` | 卡片内文字 |
| `--color-muted` | `#EFDFC0` 浅棕 | 次级面板/表头/斑马纹 |
| `--color-muted-foreground` | `#6F5D40` 中棕 | 次级文字（≈5.4:1 ✅） |
| `--color-border` | `rgba(90,70,40,0.25)` | 常规分隔线（弱） |
| `--color-border-strong` | `#A98754` 木框棕 | 面板描边（木框） |
| `--color-destructive` | `#A94438` | 错误/离线/告警 |
| `--color-on-destructive` | `#FFFFFF` | 错误底色上的文字 |
| `--color-ring` | `#C08A2E` 金黄 | 焦点环 |
| `--color-gold` | `#C08A2E` 金黄 | 点缀/图表用量（"金币"感） |

> 配色逻辑：**奶油底 + 木框棕 + 深棕文字 + 叶绿/金黄/天空蓝点缀** —— 像星露谷的农场账本：温暖底色承载信息，绿色代表"健康/收获"，金色代表"财富/数值"，蓝色保持清爽。

### 3.2 文本用色的对比度补充（重要）

色板中作为**大面积背景/图形**的颜色（`#6B9B37`、`#C08A2E`）对比度约 2.6–3.3:1，**只允许用于大号文字、图标、图形、边框**；
**小号正文（<18px）必须使用深色变体**，保证 ≥4.5:1（对亮色背景）：

| 场景 | 色值 | 对比度（对 `#F6EDD9`） |
| --- | --- | --- |
| 红系正文/错误文本 | `#A94438` | ≈5.0:1 ✅ |
| 蓝系正文/Tab 文字 | `#2F6496` | ≈5.4:1 ✅ |
| 绿系正文 | `#45701F` | ≈5.0:1 ✅ |
| 次级文字 | `#6F5D40` | ≈5.4:1 ✅ |

### 3.3 状态色语义（全局一致）

- 正常/在线/成功：绿 `#6B9B37`（图形/方块）/ `#45701F`（小号文本）
- 告警/离线/错误：红 `#A94438`（文本与图形统一）
- 中性/进行中：蓝 `#2F6496` / `#6FA8DC`
- **不得只用颜色传达状态**：状态必须同时有文字/图标/形状（见 §9）。

### 3.4 暗色主题色板（夜间 / 矿洞变体）

暗色是星露谷"夜晚/矿洞"的暖暗版：深暖棕黑底、暖米文字，点缀色提亮。

| Token | 色值 | 说明 |
| --- | --- | --- |
| `--color-primary` | `#C96A5C` 亮砖红 | 主强调/警示（暗底上提亮） |
| `--color-on-primary` | `#FFFFFF` | 红色底上的文字 |
| `--color-secondary` | `#6FA8DC` 亮天空蓝 | 次要强调、Tab 激活 |
| `--color-on-secondary` | `#2B2320` | 蓝色底上的文字（深字保证对比） |
| `--color-accent` | `#8FBF5A` 亮叶绿 | 成功/在线 |
| `--color-on-accent` | `#2B2320` | 绿色底上的文字 |
| `--color-background` | `#2B2320` 深暖棕黑 | 页面背景 |
| `--color-foreground` | `#EFE3C8` 暖米 | 主文字（≈12:1 ✅） |
| `--color-card` | `#3A2F28` 深棕面板 | 卡片背景 |
| `--color-card-foreground` | `#EFE3C8` | 卡片内文字 |
| `--color-muted` | `#45372C` | 次级面板/表头 |
| `--color-muted-foreground` | `#B8A583` 暖灰棕 | 次级文字（≈6.4:1 ✅） |
| `--color-border` | `rgba(240,220,180,0.14)` | 分隔线 |
| `--color-border-strong` | `rgba(240,220,180,0.32)` | 面板描边 |
| `--color-destructive` | `#C96A5C` | 错误/离线 |
| `--color-on-destructive` | `#FFFFFF` | 错误底色上的文字 |
| `--color-ring` | `#E8B84B` 金黄 | 焦点环 |
| `--color-gold` | `#E8B84B` | 点缀/图表用量 |

暗色文本变体（全部 ≥4.5:1，对 `#2B2320`）：

| 场景 | 色值 | 对比度 |
| --- | --- | --- |
| 红系正文/错误文本 | `#D97E6E` | ≈5.3:1 ✅ |
| 蓝系正文/Tab 文字 | `#8DBBE0` | ≈7.6:1 ✅ |
| 绿系正文 | `#A4CC74` | ≈8.4:1 ✅ |
| 次级文字 | `#B8A583` | ≈6.4:1 ✅ |

### 3.5 主题切换机制（Light / Dark / System 三档）

- **三档偏好**：`light`（亮色）/ `dark`（暗色）/ `system`（跟随系统）；`system` 档实时解析 `prefers-color-scheme` 为实际 `light`/`dark`。
- **切换方式**：`<html data-theme="light|dark">`，两套色板通过 CSS 变量切换，组件内一律引用变量、**禁止写死色值**：

```css
:root, [data-theme="light"] { /* §3.1 亮色色板（默认） */ }
[data-theme="dark"]        { /* §3.4 暗色色板 */ }
```

- **默认跟随系统**：未选择时默认 `system`（按 `prefers-color-scheme`，兜底亮色；星露谷主风格是明亮田园，多数系统默认下即亮色）。
- **持久化**：选择后写入 `localStorage`（key `theme`，值为 `light` | `dark` | `system`），刷新/重开保持。
- **系统跟随**：`system` 档下监听 `matchMedia('(prefers-color-scheme: dark)')` 变化实时生效；手动选择 `light`/`dark` 后以手动为准。
- **Vue 实现建议**：封装 composable（`useTheme()`），暴露响应式 `preference`（用户档位）、`theme`（生效主题，computed，`system` 已解析）与 `setPreference()`；生效主题变化自动同步 `<html data-theme>`，图表 `watch(theme)` 换色。
- **切换动效**：像素风 → **即时切换**（0ms）；若需要过渡，用 100–150ms `steps()` 硬切，且 `prefers-reduced-motion: reduce` 时禁用。
- **图表同步**：ECharts 不自动跟随 CSS 变量，主题切换后必须更新图表配色（见 §7.7）。

---

## 4. 字体（Typography）

**字体组合：Pixelify Sans（圆润像素，标题/数字）+ 系统中文（正文）**

- **Pixelify Sans**（本地自托管）：圆润、可读性好的像素字体，观感贴近星露谷 UI 的柔和像素数字与标题。官方**可变字体**（wght 轴 400–700）文件 `PixelifySans-VariableFont_wght.ttf` 存放在 `frontend/public/fonts/pixelify-sans/`（`OFL.txt` 许可证与 `README.txt` 随包存放），由 `frontend/src/styles/main.css` 顶部的单个 `@font-face`（`font-weight: 400 700`）加载，**不依赖 Google Fonts CDN**；如需其他字重/子集，请直接替换该目录下官方文件并保持 `@font-face` 一致。
- **中文**：Pixelify Sans 不含中文字形，中文一律回退系统字体（`Noto Sans SC` / `Microsoft YaHei`），通过字号/字重/字距保持视觉统一；如项目引入开源中文像素字体（如 [Fusion Pixel 融合像素](https://github.com/TakWolf/fusion-pixel-font)），可将其置于中文回退链首位。

```css
--font-display: "Pixelify Sans", "Fusion Pixel 12px Proportional ZH Hans",
  "Noto Sans SC", "Microsoft YaHei", sans-serif;
--font-body: "Pixelify Sans", "Noto Sans SC", "Microsoft YaHei", sans-serif;
```

### 字号阶梯（对齐 4px 网格，body 基准 ≥16px）

| 层级 | 字体 | 字号 | 行高 | 用法 |
| --- | --- | --- | --- | --- |
| H1 页头 | Pixelify Sans / 系统中文字重 600 | 18px | 1.5 | 系统标题 |
| 章节标题 | Pixelify Sans / 系统中文字重 600 | 14px | 1.6 | 卡片标题 |
| 统计大数字 | Pixelify Sans 600 | 24px | 1.3 | StatsGrid 数值（"账本"感） |
| 正文/表格 | Pixelify Sans / 系统中文 | 16px | 1.5 | 表格、描述、标签 |
| 次级/提示 | Pixelify Sans / 系统中文 | 14–16px | 1.5 | 副标题、页脚（对比度用 `--color-muted-foreground`） |

> 数字在 Pixelify Sans 下圆润像素、易于阅读；避免使用过窄的等宽像素字体做正文。
> 中文不强行像素化：中文字形像素化渲染不可控，用系统字体加粗配合整体暖色面板即可保持田园观感。

---

## 5. 布局与响应式（Layout）

### 5.1 布局原则

1. **像素网格**：栅格、间距、尺寸全部为 4px 倍数（同 §2.1）；内容最大宽度 `1280px` 居中，禁止固定 px 容器宽造成横向滚动。
2. **账本信息流**：自上而下 = 顶栏（公告栏）→ 统计（账本数字）→ 趋势图表 → 明细表格；关键数据（余额、在线状态、最近更新时间）首屏可见。
3. **移动优先（mobile-first）**：先单列堆叠，再按断点升级为多列；任何断点下页面级无横向滚动。

### 5.2 页面骨架（对应 App.vue）

```
┌──────────────────────────────────────────┐
│ DashboardHeader（sticky 顶栏）              │
│   标题 + 状态（状态点 · 更新时间）+ 刷新/语言/主题 │
├──────────────────────────────────────────┤
│ StatsGrid「账本」：3~4 个统计卡并排           │
├──────────────────────────────────────────┤
│ 图表区（charts-grid，CSS Grid 自适应）        │
│   ├ 2 列并排：BalanceChart │ TotalChart      │
│   └ 全宽行：HourlyUsageChart                 │
├──────────────────────────────────────────┤
│ 明细卡片：Tabs（明细记录 / 通知历史）           │
│   └ RecordsTable / NoticeHistory（容器内滚动）│
├──────────────────────────────────────────┤
│ Footer                                     │
└──────────────────────────────────────────┘
```

### 5.3 栅格与断点

| 断点（宽度） | 统计卡 | 图表区 | 说明 |
| --- | --- | --- | --- |
| ≥1024px | 3–4 列 | 2 列 + 全宽行 | 桌面布局 |
| 768–1023px | 2–3 列 | 2 列（压缩） | 平板 |
| <768px（从 375px 起） | 1–2 列 | 单列堆叠 | 移动：顶栏换行、表格在容器内横向滚动 |

- 一律用 CSS Grid（`grid-template-columns: repeat(n, minmax(0, 1fr))`）+ `flex-wrap`，**不设固定列宽**。
- 断点值本身对齐 4px 网格（375 / 768 / 1024 / 1280 / 1440）。

### 5.4 间距节奏（紧凑型 dashboard）

| 位置 | 间距 |
| --- | --- |
| 页面 main 内边距 | 12–16px |
| 大区块（卡片）间距 | 12px |
| 卡片内边距 | 12px |
| 统计卡间距 / 图表间距 | 8px |
| 图表高度 | 200px（容器等比） |

> 全部为 4px 倍数；紧凑节奏符合"账本面板"密度，但相邻可点元素间距 ≥8px。

### 5.5 信息层级

- 视觉焦点 = 统计大数字（Pixelify Sans 24px，§4）。
- 卡片标题统一左上角 + 副标题补充；标题层级一眼可辨。
- 表格关键列（状态）用状态点 + 文字（§7.6），不沉底；时间列保持可读格式。

### 5.6 移动端 / 小屏要点

- 长表格与长内容在**容器内**滚动（`max-height + overflow: auto`），页面本身不横向滚动。
- 图表容器自适应高度；顶栏 `flex-wrap` 换行。
- 点击目标 ≥44px、间距 ≥8px（见 §9 无障碍）。
- 375px 下统计卡降为 1–2 列，统计数字可降一档但保持 ≥20px。

---

## 6. 像素化技术要点（CSS）

- `--pixel-size: 4px`：间距、内边距、边框、阴影偏移全部是 4 的倍数。
- **木框面板**（星露谷质感）：奶油底 + 2px 木框棕描边 + 内侧高光线 + 暖色硬阴影：
  ```css
  border: 2px solid var(--color-border-strong);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.55),
    4px 4px 0 rgba(90, 70, 40, 0.35);
  ```
  （暗色主题下高光线改为 `rgba(240,220,180,0.08)`，阴影改 `rgba(0,0,0,0.45)`）
- **纸纹底纹**（可选，极淡）：`background-image: radial-gradient(rgba(90,70,40,0.05) 1px, transparent 1px); background-size: 4px 4px;`，叠加在背景色上，不影响对比度。
- 圆角：统一 `2–4px`；禁止 `blur()` 模糊与柔和渐变阴影（`box-shadow` 带大 blur）。
- 图片/Canvas 像素感：`image-rendering: pixelated;`（需要位图素材时）。

---

## 7. 组件规范

### 7.1 卡片（木框面板）
- 背景 `--color-card`（奶油），`border: 2px solid var(--color-border-strong)`（木框棕），圆角 `4px`。
- 双层阴影：内侧高光线 + 外侧暖色硬阴影（§6 木框面板配方）。
- 卡片标题 Pixelify Sans 14px；副标题 14–16px `--color-muted-foreground`。

### 7.2 按钮（木钮 / 账本按钮）
- 常规按钮：`background: var(--color-muted)`（浅棕）+ `border: 2px solid var(--color-border-strong)`，文字 `--color-foreground`，圆角 `4px`。
- 按下反馈：`transform: translate(2px, 2px)` + 阴影从 `4px 4px 0` 缩到 `2px 2px 0`，**位移 + 阴影同步，150–250ms**。
- 主 CTA（如需强调）：可用 `--color-accent`（叶绿）底 + 深字或白字；禁用态不透明度 0.5。
- 刷新/主题按钮：描边按钮（`--color-muted` 底 + 木框描边 + 硬阴影），hover 加深背景。

### 7.3 徽章 / Chip
- 圆角 `4px`，`1px` 边框 + 2px 硬阴影，内边距 `4px 8px`。
- 语义色同 §3.3；文字对比度遵循 §3.2。

### 7.4 表格
- 表头背景 `--color-muted`（浅棕）+ Pixelify Sans 14px / 系统中文字重 600。
- 斑马纹：偶数行 `--color-row-alt`（暖色淡层）；hover 行叶绿淡层 `--color-row-hover`。
- 单元格 `white-space: nowrap`，数字列右对齐（像素字体自然对齐）。
- 分隔线用 `--color-border`；表头 sticky 时背景保持不透明。

### 7.5 Tab
- 激活态：文字 `--color-gold`（金黄）+ `2px` 实线下边框（同色）；hover 文字变 `--color-foreground`。
- 保持"按下即切换"，无滑动动画。

### 7.6 状态点
- **方块**（8px 正方形，圆角 2px），颜色按 §3.3，可选微弱同色发光（`box-shadow: 0 0 4px`）。
- 旁边**必须带文字标签**（如"在线/离线"），不单独依赖颜色。

### 7.7 图表（ECharts 田园像素配置）

- **实现**：图表用 **ECharts** 绘制，样式尽可能像素化 / 田园化（规范 §6 技术要点）。
- **直角、不光滑**：`smooth: false`，直角折线 + 半透明面积。
- 符号用方块：`symbol: 'rect'`（`symbolSize: 6`），不用圆点。
- 网格线：暖棕淡色虚线（`splitLine.lineStyle.type: 'dashed'`）；坐标轴文字 `--color-muted-foreground` 色，Pixelify Sans 12px（echarts `textStyle.fontFamily`）。
- 系列色：余额叶绿 `#6B9B37`（暗色 `#8FBF5A`）、总量天空蓝 `#2F6496`（暗色 `#6FA8DC`）、用量金黄 `#C08A2E`（暗色 `#E8B84B`）。
- **交互**：滚轮缩放（`dataZoom: inside`）+ 底部滑块（`dataZoom: slider`：浅棕底 / 金黄选区 / 木框描边）、初始定位最近 24h（`startValue`）；tooltip 奶油面板 + 深棕字 + 木框描边 + 圆角 4px（`extraCssText`），axisPointer 十字虚线。
- 多个系列时：颜色之外再配线型（实线/虚线/点线）区分，不能只靠颜色（§9）。
- **主题切换**：颜色对象来自 `useChartTheme()`（§3.1 / §3.4），主题变化时 `chart.setOption` 更新配色（`watch(theme)`）。
- 轴刻度隐藏（`axisTick.show: false`）、y 轴线隐藏（`axisLine.show: false`），保持像素简洁。

---

## 8. 动效（Motion）

- **节奏**：温和。过渡 150–250ms；状态切换可用"即时"（0ms 跳变）或短 `steps()` 硬切——像素感的标志。
- **允许的效果**：
  - 帧动画 / 逐帧序列（如加载中的小动物/作物图标）。
  - **闪烁光标**：加载或"等待刷新"时显示 `▌` 方块光标闪烁（`steps()` 步进动画，非平滑 opacity）。
  - 按钮按下位移（§7.2）、卡片阴影收缩。
  - 数值更新时的轻微"跳动"（steps 动画），像账本数字翻动。
- **禁止**：平滑缓动的弹性动画、宽高过渡（layout thrashing）、长时间循环动画。
- **`prefers-reduced-motion: reduce` 时必须全部关闭**：停止闪烁、帧动画，保留静态提示（如静态"加载中…"文字）。

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9. 无障碍（Accessibility）——必须达标

1. **对比度**：正文 ≥4.5:1（按 §3.2 / §3.4 使用变体表）；大字/图形 ≥3:1。
2. **键盘导航**：所有交互元素可 Tab 到达；**可见焦点环**——`outline: 2px solid var(--color-ring); outline-offset: 2px;`（金黄焦点环，暗色下同样金黄），聚焦时明显可见。
3. **不依赖颜色**：状态同时用文字/图标/形状表达（§3.3、§7.6）；图表系列辅以线型区分（§7.7）。
4. **图标**：一律 SVG（像素化线性图标），**禁止 emoji 当图标**；装饰性图标 `aria-hidden="true"`，功能性图标带可访问名称。
5. **点击目标**：移动端最小 44×44px；间距 ≥8px。
6. **动效开关**：尊重 `prefers-reduced-motion`（§8）。
7. **加载反馈**：刷新/加载必须有可见反馈（闪烁光标或文字），不能静默。
8. **表单/表格**：标签可见（不只用 placeholder）；表格提供列头与合理语义。

---

## 10. 反模式（Avoid）

- ❌ 霓虹/赛博/街机式高饱和（荧光蓝、电光紫、暗黑底+霓虹线）——本风格是温暖田园，不是 arcade。
- ❌ 毛玻璃、模糊阴影、冷色大渐变、"玻璃拟态"。
- ❌ 超出 §3 色板之外的任意新颜色。
- ❌ 中文强行像素化渲染（字形模糊/锯齿），中文用系统字体加粗。
- ❌ emoji 当图标、抗锯齿化的模糊图片、非 4px 网格的偏移。
- ❌ 依赖 hover 才能看到的信息（表格行详情、图表数值）。
- ❌ 长时不减的闪烁/跑马灯（既伤可读又触犯 reduced-motion）。
- ❌ 为"像素感"牺牲可读性：正文字号 <16px、对比度 <4.5:1。

---

## 11. 交付前检查清单（Pre-Delivery Checklist）

- [ ] 无 emoji 图标（全部 SVG）
- [ ] 所有可点击元素 `cursor: pointer`，hover 过渡 150–250ms 内
- [ ] 正文对比度 ≥4.5:1（对照 §3.2 / §3.4 变体表）
- [ ] 键盘导航焦点可见（金黄焦点环）
- [ ] `prefers-reduced-motion` 已处理
- [ ] 响应式：375 / 768 / 1024 / 1440px 无横向滚动、无固定 px 容器宽
- [ ] 图表不单靠颜色传达信息（线型/文字/图例兜底）
- [ ] 所有尺寸、间距、偏移对齐 4px 网格；圆角 2–4px
- [ ] 加载/刷新有可见反馈
- [ ] 主题三档可切换（亮色/暗色/跟随系统）：默认跟随系统、localStorage 持久化、system 档实时跟随、图表同步换色

---

## 12. 来源

本文档由 ui-ux-pro-max 设计系统（Pixel Art 风格条目）为基础，按 **Stardew Valley（星露谷物语）** 田园像素视觉方向定制：
- 暖色板（奶油/木棕/叶绿/金黄/天空蓝/砖红）参考星露谷 UI 面板配色逻辑；
- 字体组合（Pixelify Sans 圆润像素 + 系统中文字体）适配中文监控面板场景；
- 图表建议参考实时监控/趋势图规则（Real-Time Streaming / Line Chart）与无障碍规则（contrast-text-4.5、keyboard、visible-focus、reduced-motion）。
