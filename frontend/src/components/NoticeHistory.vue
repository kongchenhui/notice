<script setup>
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
          <th>通知时间</th>
          <th>剩余电量</th>
          <th>电表读数</th>
          <th>通讯时间</th>
          <th>发送状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data.length">
          <td colspan="5" style="text-align: center; color: #6b7280; padding: 20px">
            暂无通知记录
          </td>
        </tr>
        <tr v-for="item in data" :key="item.id">
          <td>{{ formatTimeStr(item.created_at) }}</td>
          <td>{{ formatNumber(item.balance) }} 度</td>
          <td>{{ formatNumber(item.total) }}</td>
          <td>{{ formatTimeStr(item.last_communication_time) }}</td>
          <td>
            <span class="badge">
              <span
                class="dot"
                :class="{ 'dot-bad': !item.email_sent }"
              ></span>
              {{ item.email_sent ? "成功" : "失败" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
