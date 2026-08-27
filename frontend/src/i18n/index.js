// 国际化入口（vue-i18n，composition 模式）
// - 语言：zh-CN（默认/回退） + en-US
// - 初始值：localStorage(locale) → navigator.language → zh-CN
// - 手动选择持久化到 localStorage key "locale"
import { createI18n } from "vue-i18n";
import zhCN from "./locales/zh-CN.js";
import enUS from "./locales/en-US.js";

export const SUPPORTED_LOCALES = ["zh-CN", "en-US"];
const LOCALE_KEY = "locale";

function resolveInitialLocale() {
  if (typeof window === "undefined") return "zh-CN";
  const saved = localStorage.getItem(LOCALE_KEY);
  if (SUPPORTED_LOCALES.includes(saved)) return saved;
  const nav = (navigator.language || "zh-CN").toLowerCase();
  return nav.startsWith("zh") ? "zh-CN" : "en-US";
}

const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

/** 切换语言并持久化，同步 <html lang> 与页面标题 */
export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_KEY, locale);
  document.documentElement.lang = locale;
  document.title = i18n.global.t("app.title");
}

// 首屏同步 <html lang> 与标题（title 静态兜底见 index.html）
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.global.locale.value;
  document.title = i18n.global.t("app.title");
}

export default i18n;
