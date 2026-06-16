<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: { type: Array, default: () => [] },
});

const chartDom = ref(null);
let chart = null;

function formatTimeStr(t) {
  if (!t) return "--";
  return String(t).replace(/:([0-5]\d)(:\d{2})?$/, ":$1");
}

function formatNumber(n, digits = 3) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "--";
  return Number(n).toFixed(digits);
}

function parseDateTimeToMs(t) {
  if (!t) return null;
  const s = String(t).trim();
  const m = s.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!m) return null;
  const [, year, month, day, hour, minute, second] = m;
  const yyyy = Number(year);
  const mm = Number(month) - 1;
  const dd = Number(day);
  const hh = Number(hour);
  const mi = Number(minute);
  const ss = second ? Number(second) : 0;
  const d = new Date(yyyy, mm, dd, hh, mi, ss);
  const ts = d.getTime();
  return Number.isNaN(ts) ? null : ts;
}

function get24hStartIndex(times) {
  if (!Array.isArray(times) || !times.length) return 0;
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  let startIndex = 0;
  for (let i = 0; i < times.length; i++) {
    const ts = parseDateTimeToMs(times[i]);
    if (ts != null && ts >= cutoff) {
      startIndex = i;
      break;
    }
  }
  return startIndex;
}

function renderChart() {
  if (!chart) return;
  const data = props.data || [];

  // 筛选有 hourly_usage 的数据点
  const rawTimes = [];
  const values = [];

  for (const item of data) {
    if (item.hourly_usage == null || Number.isNaN(Number(item.hourly_usage))) continue;
    rawTimes.push(item.last_communication_time);
    values.push(Number(item.hourly_usage));
  }

  if (!values.length) {
    chart.clear();
    return;
  }

  const xAxisData = rawTimes.map((t) => formatTimeStr(t));
  const startIndex = get24hStartIndex(rawTimes);

  chart.setOption({
    animation: true,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: "#1f2937" } },
      valueFormatter: (value) =>
        value == null ? "--" : `${formatNumber(value, 3)} kWh`,
    },
    grid: {
      left: "6%",
      right: "6%",
      top: 30,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
      axisLabel: { color: "#9ca3af", fontSize: 10 },
      axisLine: { lineStyle: { color: "#374151" } },
    },
    yAxis: {
      type: "value",
      name: "每小时用电量",
      axisLabel: { color: "#9ca3af", fontSize: 10 },
      axisLine: { lineStyle: { color: "#4b5563" } },
      splitLine: { lineStyle: { color: "rgba(55,65,81,0.5)" } },
    },
    dataZoom: [
      { type: "inside", xAxisIndex: 0, filterMode: "none", startValue: startIndex },
      { type: "slider", xAxisIndex: 0, height: 14, bottom: 2, startValue: startIndex },
    ],
    series: [
      {
        name: "每小时用电量",
        type: "line",
        data: values,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#34d399", width: 2 },
        areaStyle: { color: "rgba(52,211,153,0.18)" },
      },
    ],
  });
}

onMounted(() => {
  if (chartDom.value) {
    chart = echarts.init(chartDom.value);
    renderChart();
  }
});

onUnmounted(() => {
  if (chart) chart.dispose();
});

watch(() => props.data, renderChart, { deep: true });

function onResize() {
  if (chart) chart.resize();
}
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));
</script>

<template>
  <div ref="chartDom" class="chart" style="height: 150px"></div>
</template>
