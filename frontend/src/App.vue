<script setup>
import { useApi } from "./composables/useApi.js";
import DashboardHeader from "./components/DashboardHeader.vue";
import StatsGrid from "./components/StatsGrid.vue";
import BalanceChart from "./components/BalanceChart.vue";
import TotalChart from "./components/TotalChart.vue";
import HourlyUsageChart from "./components/HourlyUsageChart.vue";
import RecordsTable from "./components/RecordsTable.vue";
import NoticeHistory from "./components/NoticeHistory.vue";
import { ref } from "vue";

const { records, notices, stats, loading, error, lastUpdate, refresh } = useApi();

// Tab 切换：records / notices
const activeTab = ref("records");
</script>

<template>
  <DashboardHeader
    :loading="loading"
    :error="error"
    :lastUpdate="lastUpdate"
    :pointCount="records.length"
    @refresh="refresh"
  />

  <main>
    <!-- 趋势卡片 -->
    <section class="card">
      <StatsGrid :stats="stats" :records="records" />

      <div class="charts-grid">
        <div class="chart-wrapper">
          <BalanceChart :data="records" />
        </div>
        <div class="chart-wrapper">
          <TotalChart :data="records" />
        </div>
        <div class="chart-wrapper chart-full">
          <div class="card-subtitle" style="margin-top: 0">
            每小时用电量（根据电表读数差值汇总）：
          </div>
          <HourlyUsageChart :data="records" />
        </div>
      </div>
    </section>

    <!-- 数据明细卡片（Tab 切换） -->
    <section class="card">
      <div class="card-header">
        <div>
          <div class="card-title">
            {{ activeTab === "records" ? "明细 · 最近读取记录" : "通知 · 历史发送记录" }}
          </div>
          <div class="card-subtitle">
            {{
              activeTab === "records"
                ? "按时间倒序显示最近的读取数据和状态。"
                : "查看系统发送的电费余额预警通知。"
            }}
          </div>
        </div>
      </div>

      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'records' }"
          @click="activeTab = 'records'"
        >
          明细记录
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'notices' }"
          @click="activeTab = 'notices'"
        >
          通知历史
        </button>
      </div>

      <RecordsTable v-if="activeTab === 'records'" :data="records" />
      <NoticeHistory v-if="activeTab === 'notices'" :data="notices" />
    </section>
  </main>

  <div class="footer">
    电费监控系统 v2.0
  </div>
</template>
