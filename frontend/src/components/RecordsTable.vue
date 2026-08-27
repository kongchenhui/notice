<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
          <th>{{ t("records.time") }}</th>
          <th>{{ t("records.balance") }}</th>
          <th>{{ t("records.meter") }}</th>
          <th>{{ t("records.hourly") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!reversed.length">
          <td colspan="4" class="empty-text" style="text-align: center; padding: 20px">
            {{ t("records.empty") }}
          </td>
        </tr>
        <tr v-for="item in reversed" :key="item.id">
          <td>{{ formatTimeStr(item.last_communication_time) }}</td>
          <td>{{ formatNumber(item.balance) }}</td>
          <td>{{ formatNumber(item.total) }}</td>
          <td>
            {{
              item.hourly_usage != null
                ? formatNumber(item.hourly_usage, 3) + " " + t("units.kwh")
                : "--"
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
