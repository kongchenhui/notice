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

function formatNumber(n, digits = 2) {
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

  if (!data.length) {
    chart.clear();
    return;
  }

  const times = data.map((d) => d.last_communication_time);
  const balances = data.map((d) => d.balance);
  const xAxisData = times.map((t) => formatTimeStr(t));
  const startIndex = get24hStartIndex(times);

  chart.setOption({
    animation: true,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: "#1f2937" } },
      valueFormatter: (value) => formatNumber(value, 2),
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
      name: "剩余电量",
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
        name: "剩余电量",
        type: "line",
        data: balances,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#60a5fa", width: 2 },
        areaStyle: { color: "rgba(96,165,250,0.25)" },
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

// 响应窗口大小变化
function onResize() {
  if (chart) chart.resize();
}
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));
</script>

<template>
  <div>
    <div class="card-subtitle" style="margin-bottom: 4px">剩余电量趋势</div>
    <div ref="chartDom" class="chart" style="height: 170px"></div>
  </div>
</template>
