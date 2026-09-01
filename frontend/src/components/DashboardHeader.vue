<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "../composables/useTheme";
import { useClickOutside } from "../composables/useClickOutside";
import { setLocale, SUPPORTED_LOCALES } from "../i18n";
import IconRefresh from "../assets/icons/refresh.svg";
import IconLang from "../assets/icons/language.svg";
import IconThemeLight from "../assets/icons/theme-light.svg";
import IconThemeDark from "../assets/icons/theme-dark.svg";
import IconThemeSystem from "../assets/icons/theme-system.svg";
import IconMenu from "../assets/icons/menu.svg";

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

// 当前主题档位名（脚本内使用 preference.value，模板中经 computed 自动解包）
const themeOptionName = computed(() =>
  t(`header.theme.options.${preference.value}`),
);

// 主题按钮的无障碍名称：当前档位（图标本身即状态，辅以文字；分隔符随语言）
const themeLabel = computed(() =>
  t("header.theme.label", {
    aria: t("header.theme.aria"),
    option: themeOptionName.value,
  }),
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

/* ---------- 窄屏折叠菜单（<768px） ----------
   屏幕过窄时，操作按钮（刷新/语言/主题）收进汉堡菜单，
   避免英文标题 + 按钮换行；桌面宽度下菜单按钮隐藏、按钮行内展示。 */
const menuOpen = ref(false);
const menuBtnEl = ref(null);
const menuPanelEl = ref(null);

const menuLabel = computed(() =>
  t(menuOpen.value ? "header.menu.close" : "header.menu.open"),
);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  // 打开后把焦点移入菜单首项，便于键盘连续操作
  if (menuOpen.value) {
    menuPanelEl.value?.querySelector("button")?.focus();
  }
}

/** 关闭菜单；returnFocus 时把焦点还给汉堡按钮（Escape 场景） */
function closeMenu(returnFocus = false) {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  if (returnFocus) menuBtnEl.value?.focus();
}

// 点击面板（header-actions）外部收起；Escape 收起并把焦点还给汉堡按钮。
// 汉堡按钮的点击已 .stop 阻止冒泡，由 toggleMenu 单独处理（不会误触发“外部点击”）。
useClickOutside(
  menuPanelEl,
  {
    onClickOutside: () => closeMenu(),
    onEscape: () => closeMenu(true),
  },
  { enabled: () => menuOpen.value },
);
</script>

<template>
  <header>
    <div class="container">
      <h1>{{ t("app.title") }}</h1>

      <button
        ref="menuBtnEl"
        class="btn-menu"
        type="button"
        :aria-label="menuLabel"
        :title="menuLabel"
        aria-haspopup="true"
        :aria-expanded="menuOpen"
        aria-controls="header-actions"
        @click.stop="toggleMenu"
      >
        <IconMenu class="icon" />
      </button>

      <div
        id="header-actions"
        ref="menuPanelEl"
        class="meta header-actions"
        :class="{ open: menuOpen }"
      >
        <button
          class="btn-refresh"
          type="button"
          :aria-label="t('header.refresh')"
          :title="t('header.refresh')"
          @click="emit('refresh')"
        >
          <IconRefresh class="icon" :class="{ spinning: loading }" />
          <span class="btn-label">{{ t("header.refresh") }}</span>
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
          <span class="btn-label">{{
            locale === "zh-CN"
              ? t("header.lang.label.toEn")
              : t("header.lang.label.toZh")
          }}</span>
        </button>
        <button
          class="btn-theme"
          type="button"
          :aria-label="themeLabel"
          :title="themeLabel"
          @click="cycleTheme"
        >
          <component :is="themeIcon" class="icon" />
          <span class="btn-label">{{ themeOptionName }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
