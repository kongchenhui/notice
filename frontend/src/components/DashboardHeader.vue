<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "../composables/useTheme";
import { setLocale, SUPPORTED_LOCALES } from "../i18n";
import IconRefresh from "../assets/icons/refresh.svg";
import IconLang from "../assets/icons/language.svg";
import IconThemeLight from "../assets/icons/theme-light.svg";
import IconThemeDark from "../assets/icons/theme-dark.svg";
import IconThemeSystem from "../assets/icons/theme-system.svg";

const props = defineProps({
  loading: Boolean,
});

const emit = defineEmits(["refresh"]);

const { t, locale } = useI18n();
const { preference, setPreference } = useTheme();

// 主题档位切换：按钮循环 亮色 → 暗色 → 跟随系统
const THEME_ORDER = ["light", "dark", "system"];

function cycleTheme() {
  const i = THEME_ORDER.indexOf(preference.value);
  setPreference(THEME_ORDER[(i + 1) % THEME_ORDER.length]);
}

// 主题按钮的无障碍名称：当前档位（图标本身即状态，辅以文字）
const themeLabel = computed(
  () => `${t("header.theme.aria")}：${t(`header.theme.options.${preference.value}`)}`,
);

// 语言切换：在当前两种语言之间切换
function switchLocale() {
  const next =
    locale.value === SUPPORTED_LOCALES[0] ? SUPPORTED_LOCALES[1] : SUPPORTED_LOCALES[0];
  setLocale(next);
}

// 主题图标随所选档位切换：亮色=太阳 / 暗色=月亮 / 跟随系统=显示器
const themeIcons = {
  light: IconThemeLight,
  dark: IconThemeDark,
  system: IconThemeSystem,
};
const themeIcon = computed(() => themeIcons[preference.value] ?? IconThemeSystem);
</script>

<template>
  <header>
    <div class="container">
      <h1>{{ t("app.title") }}</h1>
      <div class="meta header-actions">
        <button
          class="btn-refresh"
          type="button"
          :aria-label="t('header.refresh')"
          :title="t('header.refresh')"
          @click="emit('refresh')"
        >
          <IconRefresh class="icon" :class="{ spinning: loading }" />
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
          <IconLang class="icon" />
        </button>
        <button
          class="btn-theme"
          type="button"
          :aria-label="themeLabel"
          :title="themeLabel"
          @click="cycleTheme"
        >
          <component :is="themeIcon" class="icon" />
        </button>
      </div>
    </div>
  </header>
</template>
