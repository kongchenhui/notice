<script setup>
import { useI18n } from "vue-i18n";
import { useApi } from "./composables/useApi.js";
import DashboardHeader from "./components/DashboardHeader.vue";
import StatsGrid from "./components/StatsGrid.vue";
import BalanceChart from "./components/BalanceChart.vue";
import TotalChart from "./components/TotalChart.vue";
import HourlyUsageChart from "./components/HourlyUsageChart.vue";
import RecordsTable from "./components/RecordsTable.vue";
import NoticeHistory from "./components/NoticeHistory.vue";
import { ref } from "vue";

const { t } = useI18n();
const { records, notices, stats, loading, refresh } = useApi();

// Tab 切换：records / notices
const activeTab = ref("records");
</script>

<template>
  <DashboardHeader :loading="loading" @refresh="refresh" />

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
            {{ t("charts.hourlySummary") }}
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
            {{
              activeTab === "records"
                ? t("tabs.title.records")
                : t("tabs.title.notices")
            }}
          </div>
          <div class="card-subtitle">
            {{
              activeTab === "records"
                ? t("tabs.subtitle.records")
                : t("tabs.subtitle.notices")
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
          {{ t("tabs.records") }}
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'notices' }"
          @click="activeTab = 'notices'"
        >
          {{ t("tabs.notices") }}
        </button>
      </div>

      <RecordsTable v-if="activeTab === 'records'" :data="records" />
      <NoticeHistory v-if="activeTab === 'notices'" :data="notices" />
    </section>
  </main>

  <div class="footer">
    {{ t("app.footer") }}
  </div>
</template>
