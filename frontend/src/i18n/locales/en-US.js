// English (US)
export default {
  app: {
    title: "Electricity Monitoring",
    footer: "Electricity Monitoring System v2.0",
  },
  header: {
    refresh: "Refresh",
    theme: {
      aria: "Select theme",
      options: { light: "Light", dark: "Dark", system: "System" },
    },
    lang: {
      // Button shows the *target* language (opposite of current)
      label: { toZh: "中文", toEn: "EN" },
      aria: {
        toZh: "Switch to Chinese",
        toEn: "Switch to English",
      },
    },
  },
  units: {
    balance: "kWh",
    kwh: "kWh",
  },
  stats: {
    balance: "Current Balance",
    meter: "Current Meter Reading",
    hourly: "Last Hourly Usage",
  },
  tabs: {
    title: {
      records: "Records · Recent Readings",
      notices: "Notices · History",
    },
    subtitle: {
      records: "Recent readings and status, newest first.",
      notices: "Past balance alert notifications.",
    },
    records: "Records",
    notices: "Notice History",
  },
  records: {
    time: "Read Time",
    balance: "Balance",
    meter: "Meter Reading",
    hourly: "Hourly Usage",
    empty: "No data",
  },
  notices: {
    time: "Notice Time",
    balance: "Balance",
    meter: "Meter Reading",
    commTime: "Comm. Time",
    status: "Status",
    empty: "No notice records",
    sent: "Sent",
    failed: "Failed",
  },
  charts: {
    balance: {
      title: "Balance Trend",
      axis: "Balance",
      series: "Balance",
    },
    total: {
      title: "Meter Reading Trend",
      axis: "Meter Reading",
      series: "Meter Reading",
    },
    hourly: {
      axis: "Hourly Usage",
      series: "Hourly Usage",
    },
    hourlySummary: "Hourly usage (derived from meter reading deltas):",
  },
};
