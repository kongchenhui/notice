// 亮暗主题 composable（规范：docs/game-pixel-style.md §3.5）
// - 切换方式：<html data-theme="light|dark"> + CSS 变量
// - 持久化：localStorage key "theme"
// - 初始值：localStorage → prefers-color-scheme → 兜底 dark
// - 未手动选择时跟随系统 prefers-color-scheme 变化
import { ref } from "vue";

const THEME_KEY = "theme";

function resolveInitial() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // 默认亮色（星露谷主风格为明亮田园）
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

const theme = ref(resolveInitial());

function applyTheme(t) {
  theme.value = t;
  document.documentElement.dataset.theme = t;
}

export function useTheme() {
  function toggleTheme() {
    const next = theme.value === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }
  return { theme, toggleTheme };
}

// 模块加载即应用（与 index.html 内联脚本结果保持一致）
applyTheme(theme.value);

// 未手动选择时跟随系统
if (typeof window !== "undefined" && !localStorage.getItem(THEME_KEY)) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  };
  if (mq.addEventListener) mq.addEventListener("change", handler);
}
