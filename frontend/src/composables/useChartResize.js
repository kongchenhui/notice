import { onMounted, onUnmounted } from "vue";

/**
 * 监听图表容器尺寸变化，自动触发 ECharts 重绘
 *
 * 用 ResizeObserver 观察图表容器（而非 window.resize）：
 * 能捕获响应式断点切换、设备旋转、flex 换行等导致的容器尺寸变化，
 * 对移动端/小屏适配更可靠；容器尺寸不变时不会多余重绘。
 *
 * @param {() => import("echarts").ECharts | null} getChart 返回当前图表实例
 * @param {() => HTMLElement | null} getDom 返回图表容器元素
 */
export function useChartResize(getChart, getDom) {
  let observer = null;
  let rafId = 0;

  onMounted(() => {
    const dom = getDom();
    if (!dom) return;
    observer = new ResizeObserver(() => {
      // rAF 防抖：合并同一帧内的连续尺寸变化，避免断点切换时高频重绘
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const chart = getChart();
        if (chart) chart.resize();
      });
    });
    observer.observe(dom);
  });

  onUnmounted(() => {
    cancelAnimationFrame(rafId);
    if (observer) observer.disconnect();
    observer = null;
  });
}
