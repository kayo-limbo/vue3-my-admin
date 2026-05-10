import { useUserStore } from "@/store/index";
import type { Directive, DirectiveBinding } from "vue";

/**
 * 💡 修复 image_3ac7d5.png 中的报错
 * 1. 使用 Directive 类型定义避免 any
 * 2. 修正 remmoveChild 拼写错误 -> removeChild
 * 3. 处理 el.parentNode 可能为 null 的情况
 */
function hasPermission(value: string[], el: HTMLElement = document.createElement('div')) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`需要配置权限, 例如 v-permission="['getStatistics3,GET']"`);
  }

  const store = useUserStore();
  
  // 检查 store.ruleNames 是否包含 value 中的任意一个权限码
  const hasAuth = value.some(v => store.ruleNames.includes(v));

  if (el && !hasAuth) {
    // 💡 确保父节点存在再删除，且修正拼写
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
}

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    hasPermission(binding.value, el);
  }
};

export default permission;