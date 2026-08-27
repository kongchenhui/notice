// 亮暗主题 composable（规范：docs/game-pixel-style.md §3.5）
// - 三档偏好：light | dark | system（跟随系统）
// - 切换方式：<html data-theme="light|dark"> + CSS 变量；system 解析为实际 light/dark
// - 持久化：localStorage key "theme"，值为 "light" | "dark" | "system"
// - 默认：跟随系统（未选择时按 prefers-color-scheme，兜底亮色）
import { ref, computed, watchEffect } from "vue";

const THEME_KEY = "theme";
const THEME_MODES = ["light", "dark", "system"];

function resolveInitialPreference() {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem(THEME_KEY);
  return THEME_MODES.includes(saved) ? saved : "system";
}

// 用户选择档位：light | dark | system
const preference = ref(resolveInitialPreference());

// 系统偏好（响应式，供 system 档解析使用）
const mq =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const systemDark = ref(mq ? mq.matches : false);

if (mq) {
  const onChange = (e) => {
    systemDark.value = e.matches;
  };
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(onChange);
  }
}

// 实际生效主题（system 解析为 light/dark；图表换色等基于此值）
const theme = computed(() =>
  preference.value === "system"
    ? systemDark.value
      ? "dark"
      : "light"
    : preference.value,
);

// 生效主题变化即应用到 <html data-theme>（含 system 档下系统偏好变化）
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value;
});

export function useTheme() {
  function setPreference(mode) {
    if (!THEME_MODES.includes(mode)) return;
    preference.value = mode;
    localStorage.setItem(THEME_KEY, mode);
  }
  return { preference, theme, setPreference };
}
