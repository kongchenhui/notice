<script setup>
import dayjs from "dayjs";
import { useTheme } from "../composables/useTheme";

defineProps({
  loading: Boolean,
  error: String,
  lastUpdate: Date,
  pointCount: Number,
});

const emit = defineEmits(["refresh"]);

const { theme, toggleTheme } = useTheme();

function formatTime(d) {
  if (!d) return "--";
  return dayjs(d).format("YYYY-MM-DD HH:mm:ss");
}
</script>

<template>
  <header>
    <div class="container">
      <div>
        <h1>电费监控看板</h1>
        <div class="meta">
          实时获取电费数据，展示剩余电量、电表读数、读取时间与状态。
        </div>
      </div>
      <div class="meta" style="display: flex; align-items: center; gap: 10px;">
        <div>
          <div class="badge">
            <span
              class="dot"
              :class="{ 'dot-bad': error }"
            ></span>
            <span id="statusText">
              {{ loading ? "正在请求数据..." : error ? "请求失败" : "数据已更新" }}
            </span>
          </div>
          <div style="margin-top: 2px">
            最近刷新：{{ formatTime(lastUpdate) }}
          </div>
        </div>
        <span class="chip" v-if="pointCount !== undefined">
          数据点：{{ pointCount }} 条
        </span>
        <button class="btn-refresh" @click="emit('refresh')">
          刷新
        </button>
        <button
          class="btn-theme"
          type="button"
          :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
          :title="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
          @click="toggleTheme"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <!-- 暗色主题显示月亮（点击切亮色）；亮色主题显示太阳（点击切暗色） -->
            <template v-if="theme === 'dark'">
              <rect x="6" y="2" width="4" height="2" fill="currentColor" />
              <rect x="4" y="4" width="4" height="2" fill="currentColor" />
              <rect x="2" y="6" width="4" height="2" fill="currentColor" />
              <rect x="2" y="8" width="4" height="2" fill="currentColor" />
              <rect x="4" y="10" width="4" height="2" fill="currentColor" />
              <rect x="6" y="12" width="4" height="2" fill="currentColor" />
            </template>
            <template v-else>
              <rect x="6" y="6" width="4" height="4" fill="currentColor" />
              <rect x="2" y="2" width="2" height="2" fill="currentColor" />
              <rect x="12" y="2" width="2" height="2" fill="currentColor" />
              <rect x="2" y="12" width="2" height="2" fill="currentColor" />
              <rect x="12" y="12" width="2" height="2" fill="currentColor" />
            </template>
          </svg>
          {{ theme === "dark" ? "亮色" : "暗色" }}
        </button>
      </div>
    </div>
  </header>
</template>
