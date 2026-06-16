<script setup>
import { computed } from "vue";

const props = defineProps({
  stats: Object,
  records: Array,
});

// 最新记录
const latest = computed(() => {
  if (props.records?.length) {
    return props.records[props.records.length - 1];
  }
  return null;
});

// 最新每小时用电量
const latestHourlyUsage = computed(() => {
  if (!props.records?.length) return null;
  for (let i = props.records.length - 1; i >= 0; i--) {
    if (props.records[i].hourly_usage != null) {
      return props.records[i].hourly_usage;
    }
  }
  return null;
});

function fmt(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "--";
  return Number(n).toFixed(digits);
}
</script>

<template>
  <div class="stats-grid">
    <div class="stat">
      <div class="stat-label">当前剩余电量</div>
      <div
        class="stat-value"
        :class="{
          'status-bad': latest && latest.balance < 20,
          'status-ok': latest && latest.balance >= 20,
        }"
      >
        {{ fmt(latest?.balance) }} 度
      </div>
    </div>
    <div class="stat">
      <div class="stat-label">当前电表读数</div>
      <div class="stat-value">{{ fmt(latest?.total, 1) }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">最近每小时用电量</div>
      <div class="stat-value">
        {{ latestHourlyUsage != null ? fmt(latestHourlyUsage, 3) + " kWh" : "--" }}
      </div>
    </div>
  </div>
</template>
