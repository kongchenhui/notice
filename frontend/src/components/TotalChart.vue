<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { useChartTheme } from "../composables/useChartTheme";

const props = defineProps({
  data: { type: Array, default: () => [] },
});

const chartDom = ref(null);
let chart = null;

const { theme, colors } = useChartTheme();

const FONT = "Pixelify Sans, 'Noto Sans SC', sans-serif";

function formatTimeStr(t) {
  if (!t) return "--";
  return String(t).replace(/:([0-5]\d)(:\d{2})?$/, ":$1");
}

function formatNumber(n, digits = 1) {
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
  const d = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    second ? Number(second) : 0,
  );
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

function buildOption() {
  const c = colors.value;
  const data = props.data || [];
  if (!data.length) return null;

  const times = data.map((d) => d.last_communication_time);
  const totals = data.map((d) => d.total);
  const xAxisData = times.map((t) => formatTimeStr(t));
  const startIndex = get24hStartIndex(times);

  return {
    animation: true,
    animationDuration: 300,
    textStyle: { fontFamily: FONT },
    tooltip: {
      trigger: "axis",
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      borderWidth: 2,
      padding: [6, 10],
      extraCssText: "border-radius: 4px; box-shadow: 2px 2px 0 rgba(90, 70, 40, 0.3);",
      textStyle: { color: c.tooltipText, fontFamily: FONT, fontSize: 14 },
      axisPointer: {
        type: "cross",
        lineStyle: { color: c.axisLine, type: "dashed" },
        label: {
          backgroundColor: c.axisLine,
          color: "#ffffff",
          fontFamily: FONT,
          fontSize: 12,
        },
      },
      valueFormatter: (value) => formatNumber(value, 1),
    },
    grid: { left: 48, right: 16, top: 32, bottom: 30, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
      axisTick: { show: false },
      axisLabel: { color: c.axisLabel, fontSize: 12, fontFamily: FONT },
      axisLine: { lineStyle: { color: c.axisLine } },
    },
    yAxis: {
      type: "value",
      name: "电表读数",
      nameTextStyle: { color: c.axisLabel, fontFamily: FONT, fontSize: 12 },
      axisTick: { show: false },
      axisLabel: { color: c.axisLabel, fontSize: 12, fontFamily: FONT },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
        startValue: startIndex,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        height: 12,
        bottom: 2,
        startValue: startIndex,
        borderColor: c.zoomBorder,
        backgroundColor: c.zoomBg,
        fillerColor: c.zoomFiller,
        handleStyle: { color: c.axisLabel, borderColor: c.axisLabel },
        // 隐藏中间"三个小竖线"的移动把手（moveHandleSize: 0），拖选区内侧平移 / 滚轮缩放仍可用
        moveHandleSize: 0,
        moveHandleStyle: { color: c.axisLabel },
        // 手柄 hover 不高亮成默认蓝色，保持棕色系（emphasis.handleStyle 默认 #8FB0F7）
        emphasis: {
          handleStyle: { color: c.axisLabel, borderColor: c.axisLabel },
        },
        textStyle: { color: c.axisLabel, fontFamily: FONT, fontSize: 12 },
        dataBackground: {
          lineStyle: { color: c.axisLine, width: 1 },
          areaStyle: { color: c.zoomFiller, opacity: 0.5 },
        },
        selectedDataBackground: {
          lineStyle: { color: c.axisLine, width: 1 },
          areaStyle: { color: c.zoomFiller, opacity: 0.9 },
        },
      },
    ],
    series: [
      {
        name: "电表读数",
        type: "line",
        data: totals,
        smooth: false, // 直角像素折线
        showSymbol: false,
        symbol: "rect", // 方块符号
        symbolSize: 6,
        lineStyle: { color: c.total, width: 2 },
        areaStyle: { color: c.areaTotal },
        emphasis: { focus: "series", lineStyle: { width: 3 } },
      },
    ],
  };
}

function renderChart() {
  if (!chart) return;
  const opt = buildOption();
  if (!opt) {
    chart.clear();
    return;
  }
  chart.setOption(opt);
}

function onResize() {
  if (chart) chart.resize();
}

onMounted(() => {
  if (chartDom.value) {
    chart = echarts.init(chartDom.value);
    renderChart();
  }
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  if (chart) chart.dispose();
});

watch(() => props.data, renderChart, { deep: true });

// 主题切换时同步换色（§7.7）
watch(theme, renderChart);
</script>

<template>
  <div>
    <div class="card-subtitle" style="margin-bottom: 4px">电表读数趋势</div>
    <div ref="chartDom" class="chart" style="height: 176px"></div>
  </div>
</template>
