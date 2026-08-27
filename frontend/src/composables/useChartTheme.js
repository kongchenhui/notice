// ECharts 图表主题配色（规范：docs/game-pixel-style.md §3.1 / §3.4 / §7.7）
// 返回当前主题下的图表颜色对象；主题切换时由图表组件 watch(theme) 重新 setOption
import { computed } from "vue";
import { useTheme } from "./useTheme";

// 亮色（默认，星露谷田园）
const LIGHT = {
  axisLabel: "#6f5d40", // 坐标轴文字（中棕）
  axisLine: "#a98754", // 轴线（木框棕）
  grid: "rgba(90,70,40,0.15)", // 虚线网格（暖棕淡）
  tooltipBg: "#fdf6e3", // tooltip 面板（奶油）
  tooltipBorder: "#a98754", // tooltip 描边（木框棕）
  tooltipText: "#3f3220", // tooltip 文字（深暖棕）
  zoomBg: "#efdfc0", // 缩放条背景（浅棕）
  zoomFiller: "rgba(192,138,46,0.25)", // 缩放条选区（金黄）
  zoomBorder: "rgba(90,70,40,0.3)",
  balance: "#6b9b37", // 余额叶绿
  total: "#2f6496", // 总量天空蓝
  hourly: "#c08a2e", // 每小时用电量金黄
  areaBalance: "rgba(107,155,55,0.15)",
  areaTotal: "rgba(47,100,150,0.12)",
  areaHourly: "rgba(192,138,46,0.15)",
};

// 暗色（夜间 / 矿洞变体）
const DARK = {
  axisLabel: "#b8a583",
  axisLine: "rgba(240,220,180,0.4)",
  grid: "rgba(240,220,180,0.12)",
  tooltipBg: "#3a2f28",
  tooltipBorder: "rgba(240,220,180,0.32)",
  tooltipText: "#efe3c8",
  zoomBg: "#45372c",
  zoomFiller: "rgba(232,184,75,0.25)",
  zoomBorder: "rgba(240,220,180,0.25)",
  balance: "#8fbf5a",
  total: "#6fa8dc",
  hourly: "#e8b84b",
  areaBalance: "rgba(143,191,90,0.16)",
  areaTotal: "rgba(111,168,220,0.15)",
  areaHourly: "rgba(232,184,75,0.15)",
};

export function useChartTheme() {
  const { theme } = useTheme();
  const colors = computed(() => (theme.value === "dark" ? DARK : LIGHT));
  return { theme, colors };
}
