<script setup>
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { useTheme } from "../composables/useTheme";
import { setLocale, SUPPORTED_LOCALES } from "../i18n";

defineProps({
  loading: Boolean,
  error: String,
  lastUpdate: Date,
  pointCount: Number,
});

const emit = defineEmits(["refresh"]);

const { t, locale } = useI18n();
const { preference, setPreference } = useTheme();

// 主题档位切换：亮色 / 暗色 / 跟随系统
function onThemeChange(e) {
  setPreference(e.target.value);
}

function formatTime(d) {
  if (!d) return "--";
  return dayjs(d).format("YYYY-MM-DD HH:mm:ss");
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
      <div>
        <h1>{{ t("app.title") }}</h1>
        <div class="meta">
          {{ t("header.tagline") }}
        </div>
      </div>
      <div class="meta header-actions">
        <div>
          <div class="badge">
            <span
              class="dot"
              :class="{ 'dot-bad': error }"
            ></span>
            <span id="statusText">
              {{
                loading
                  ? t("header.status.loading")
                  : error
                    ? t("header.status.error")
                    : t("header.status.ok")
              }}
            </span>
          </div>
          <div style="margin-top: 2px">
            {{ t("header.lastUpdate", { time: formatTime(lastUpdate) }) }}
          </div>
        </div>
        <span class="chip" v-if="pointCount !== undefined">
          {{ t("header.pointCount", { count: pointCount }) }}
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
