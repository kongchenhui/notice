// 简体中文（默认语言，fallbackLocale）
export default {
  app: {
    title: "电费监控看板",
    footer: "电费监控系统 v2.0",
  },
  header: {
    tagline: "实时获取电费数据，展示剩余电量、电表读数、读取时间与状态。",
    status: {
      loading: "正在请求数据...",
      error: "请求失败",
      ok: "数据已更新",
    },
    lastUpdate: "最近刷新：{time}",
    pointCount: "数据点：{count} 条",
    refresh: "刷新",
    theme: {
      aria: "选择主题",
      options: { light: "亮色", dark: "暗色", system: "跟随系统" },
    },
    lang: {
      // 按钮显示的是“目标语言”（与当前相反）
      label: { toZh: "中文", toEn: "EN" },
      aria: {
        toZh: "切换到中文",
        toEn: "切换到英文",
      },
    },
  },
  units: {
    balance: "度",
    kwh: "kWh",
  },
  stats: {
    balance: "当前剩余电量",
    meter: "当前电表读数",
    hourly: "最近每小时用电量",
  },
  tabs: {
    title: {
      records: "明细 · 最近读取记录",
      notices: "通知 · 历史发送记录",
    },
    subtitle: {
      records: "按时间倒序显示最近的读取数据和状态。",
      notices: "查看系统发送的电费余额预警通知。",
    },
    records: "明细记录",
    notices: "通知历史",
  },
  records: {
    time: "读取时间",
    balance: "剩余电量",
    meter: "电表读数",
    hourly: "每小时用电量",
    empty: "暂无数据",
  },
  notices: {
    time: "通知时间",
    balance: "剩余电量",
    meter: "电表读数",
    commTime: "通讯时间",
    status: "发送状态",
    empty: "暂无通知记录",
    sent: "成功",
    failed: "失败",
  },
  charts: {
    balance: {
      title: "剩余电量趋势",
      axis: "剩余电量",
      series: "剩余电量",
    },
    total: {
      title: "电表读数趋势",
      axis: "电表读数",
      series: "电表读数",
    },
    hourly: {
      axis: "每小时用电量",
      series: "每小时用电量",
    },
    hourlySummary: "每小时用电量（根据电表读数差值汇总）：",
  },
};
