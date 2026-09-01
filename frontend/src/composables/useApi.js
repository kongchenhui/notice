import { ref, onMounted, onUnmounted } from "vue";
import i18n from "../i18n";

/**
 * 数据获取组合式函数
 * 自动轮询 /api/data 和 /api/notices，提供加载/错误状态
 */
export function useApi() {
  const records = ref([]);
  const notices = ref([]);
  const stats = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const lastUpdate = ref(null);

  let timer = null;

  async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
      const [dataRes, noticesRes, statsRes] = await Promise.all([
        fetch("/api/data").then((r) => r.json()),
        fetch("/api/notices").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ]);

      if (dataRes.success) records.value = dataRes.data;
      else
        throw new Error(
          dataRes.message || i18n.global.t("errors.fetchFailed"),
        );

      if (noticesRes.success) notices.value = noticesRes.data;

      if (statsRes.success) stats.value = statsRes.data;

      lastUpdate.value = new Date();
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchData();
    // 每 60 秒自动刷新
    timer = setInterval(fetchData, 60_000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { records, notices, stats, loading, error, lastUpdate, refresh: fetchData };
}
