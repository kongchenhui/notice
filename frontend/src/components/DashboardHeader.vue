<script setup>
import dayjs from "dayjs";

defineProps({
  loading: Boolean,
  error: String,
  lastUpdate: Date,
  pointCount: Number,
});

const emit = defineEmits(["refresh"]);

function formatTime(d) {
  if (!d) return "--";
  return dayjs(d).format("YYYY-MM-DD HH:mm:ss");
}
</script>

<template>
  <header>
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
    </div>
  </header>
</template>
