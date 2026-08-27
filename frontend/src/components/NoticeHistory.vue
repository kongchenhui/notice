<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  data: { type: Array, default: () => [] },
});

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
          <th>{{ t("notices.time") }}</th>
          <th>{{ t("notices.balance") }}</th>
          <th>{{ t("notices.meter") }}</th>
          <th>{{ t("notices.commTime") }}</th>
          <th>{{ t("notices.status") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data.length">
          <td colspan="5" class="empty-text" style="text-align: center; padding: 20px">
            {{ t("notices.empty") }}
          </td>
        </tr>
        <tr v-for="item in data" :key="item.id">
          <td>{{ formatTimeStr(item.created_at) }}</td>
          <td>{{ formatNumber(item.balance) }} {{ t("units.balance") }}</td>
          <td>{{ formatNumber(item.total) }}</td>
          <td>{{ formatTimeStr(item.last_communication_time) }}</td>
          <td>
            <span class="badge">
              <span
                class="dot"
                :class="{ 'dot-bad': !item.email_sent }"
              ></span>
              {{ item.email_sent ? t("notices.sent") : t("notices.failed") }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
