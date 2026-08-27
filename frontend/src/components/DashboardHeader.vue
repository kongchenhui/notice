<script setup>
import dayjs from "dayjs";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "../composables/useTheme";
import { setLocale, SUPPORTED_LOCALES } from "../i18n";

const props = defineProps({
  loading: Boolean,
  error: String,
  lastUpdate: Date,
});

const emit = defineEmits(["refresh"]);

const { t, locale } = useI18n();
const { preference, setPreference } = useTheme();

// 状态文案：更新中 / 请求失败 / 已更新
const statusText = computed(() =>
  props.loading
    ? t("header.status.loading")
    : props.error
      ? t("header.status.error")
      : t("header.status.ok"),
);

// 简约时间：仅时分（完整时间见明细表）
function shortTime(d) {
  if (!d) return "--";
  return dayjs(d).format("HH:mm");
}

// 主题档位切换：亮色 / 暗色 / 跟随系统
function onThemeChange(e) {
  setPreference(e.target.value);
}

// 语言切换：在当前两种语言之间切换
function switchLocale() {
  const next =
    locale.value === SUPPORTED_LOCALES[0] ? SUPPORTED_LOCALES[1] : SUPPORTED_LOCALES[0];
  setLocale(next);
}
</script>

<template>
  <header>
    <div class="container">
      <h1>{{ t("app.title") }}</h1>
      <div class="meta header-actions">
        <span class="badge status-line">
          <span class="dot" :class="{ 'dot-bad': error }"></span>
          <span id="statusText">{{ statusText }} · {{ shortTime(lastUpdate) }}</span>
        </span>
        <button class="btn-refresh" @click="emit('refresh')">
          {{ t("header.refresh") }}
        </button>
        <button
          class="btn-lang"
          type="button"
          :aria-label="
            locale === 'zh-CN'
              ? t('header.lang.aria.toEn')
              : t('header.lang.aria.toZh')
          "
          :title="
            locale === 'zh-CN'
              ? t('header.lang.aria.toEn')
              : t('header.lang.aria.toZh')
          "
          @click="switchLocale"
        >
          {{ locale === "zh-CN" ? t("header.lang.label.toEn") : t("header.lang.label.toZh") }}
        </button>
        <label class="select-wrap" :title="t('header.theme.aria')">
          <select
            class="btn-theme"
            :value="preference"
            :aria-label="t('header.theme.aria')"
            @change="onThemeChange"
          >
            <option value="light">{{ t("header.theme.options.light") }}</option>
            <option value="dark">{{ t("header.theme.options.dark") }}</option>
            <option value="system">{{ t("header.theme.options.system") }}</option>
          </select>
          <svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <!-- 像素下箭头（下拉指示） -->
            <rect x="6" y="2" width="4" height="2" fill="currentColor" />
            <rect x="4" y="4" width="8" height="2" fill="currentColor" />
            <rect x="2" y="6" width="12" height="2" fill="currentColor" />
          </svg>
        </label>
      </div>
    </div>
  </header>
</template>
