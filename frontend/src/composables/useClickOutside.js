// 点击外部 / Escape 收起 组合式函数
// - 仅当 enabled 为 true 时才挂载 document 监听，变为 false 时立即移除（而非常驻监听 + 内部开关）
// - 点击 targetRef 指向元素的外部（且未被 ignore 忽略）时触发 onClickOutside
// - 按下 Escape 时触发 onEscape（不传则不挂载 keydown 监听）
import { computed, onBeforeUnmount, unref, watch } from "vue";

/**
 * @param {import("vue").Ref<HTMLElement | null>} targetRef 目标元素：点击其内部不触发外部关闭
 * @param {{ onClickOutside?: (e: MouseEvent) => void, onEscape?: (e: KeyboardEvent) => void }} handlers
 *        点击外部 / Escape 触发回调；Escape 不传则不监听
 * @param {{ enabled?: (() => boolean) | import("vue").Ref<boolean> | boolean,
 *           ignore?: (el: EventTarget | null) => boolean }} [options]
 *        enabled：为 true 时才挂载监听（可传函数/ref/布尔，响应式变化时自动挂载/移除）；
 *        ignore：命中该判定（如开关按钮自身）时不算“外部”
 */
export function useClickOutside(targetRef, handlers = {}, options = {}) {
  const { enabled = () => true, ignore = () => false } = options;
  const { onClickOutside, onEscape } = handlers;

  // 支持函数 / ref / 布尔三种写法，并随其依赖响应式更新
  const isEnabled = computed(() =>
    typeof enabled === "function" ? enabled() : unref(enabled),
  );

  function onDocClick(e) {
    const target = unref(targetRef);
    if (target && !target.contains(e.target) && !ignore(e.target)) {
      onClickOutside?.(e);
    }
  }

  function onDocKeydown(e) {
    if (e.key === "Escape") onEscape?.(e);
  }

  // enabled 变化时按需挂载 / 移除监听（immediate 保证初始状态立即生效）
  watch(
    isEnabled,
    (on) => {
      if (on) {
        document.addEventListener("click", onDocClick);
        if (onEscape) document.addEventListener("keydown", onDocKeydown);
      } else {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onDocKeydown);
      }
    },
    { immediate: true },
  );

  // 组件卸载时兜底清理
  onBeforeUnmount(() => {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onDocKeydown);
  });
}
