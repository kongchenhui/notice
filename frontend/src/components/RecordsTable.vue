<script setup>
import { computed } from "vue";

const props = defineProps({
  data: { type: Array, default: () => [] },
});

// 按时间倒序（最近的在上方）
const reversed = computed(() => [...props.data].reverse());

function formatTimeStr(t) {
  if (!t) return "--";
  return String(t).replace(/:([0-5]\d)(:\d{2})?$/, ":$1");
}

function formatNumber(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "--";
  return Number(n).toFixed(digits);
}
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>读取时间</th>
          <th>剩余电量</th>
          <th>电表读数</th>
          <th>每小时用电量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!reversed.length">
          <td colspan="4" style="text-align: center; color: #6b7280; padding: 20px">
            暂无数据
          </td>
        </tr>
        <tr v-for="item in reversed" :key="item.id">
          <td>{{ formatTimeStr(item.last_communication_time) }}</td>
          <td>{{ formatNumber(item.balance) }}</td>
          <td>{{ formatNumber(item.total) }}</td>
          <td>
            {{
              item.hourly_usage != null
                ? formatNumber(item.hourly_usage, 3) + " kWh"
                : "--"
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
