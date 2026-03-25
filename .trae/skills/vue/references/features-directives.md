---
name: custom-directives
description: 创建可复用的指令进行底层 DOM 操作
---

# 自定义指令

自定义指令提供对 DOM 的底层访问，用于实现可复用的行为。

## 何时使用

在以下情况使用自定义指令：
- 需要直接操作 DOM
- 行为无法通过组件或 composables 实现
- 需要将行为应用到原生元素

## 基本示例

```vue
<script setup lang="ts">
// v-focus 指令
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

## 指令钩子

```ts
const myDirective = {
  // 元素属性/监听器应用前
  created(el, binding, vnode) {},
  
  // 元素插入 DOM 前
  beforeMount(el, binding, vnode) {},
  
  // 元素和子元素挂载后
  mounted(el, binding, vnode) {},
  
  // 父组件更新前
  beforeUpdate(el, binding, vnode, prevVnode) {},
  
  // 父组件更新后
  updated(el, binding, vnode, prevVnode) {},
  
  // 父组件卸载前
  beforeUnmount(el, binding, vnode) {},
  
  // 父组件卸载后
  unmounted(el, binding, vnode) {}
}
```

## 钩子参数

```ts
interface DirectiveBinding<T = any> {
  value: T           // v-my-dir="value"
  oldValue: T        // 之前的值（仅 beforeUpdate/updated）
  arg?: string       // v-my-dir:arg
  modifiers: Record<string, boolean>  // v-my-dir.foo.bar → { foo: true, bar: true }
  instance: ComponentPublicInstance   // 使用指令的组件
  dir: ObjectDirective               // 指令定义对象
}
```

使用示例：

```vue-html
<div v-example:foo.bar="baz">
```

```ts
// binding 对象：
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* baz 的值 */,
  oldValue: /* 之前的值 */
}
```

## 函数简写

当只需要 `mounted` 和 `updated` 且行为相同时：

```ts
// 完整形式
const vColor = {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    el.style.color = binding.value
  }
}

// 简写（相同行为）
const vColor = (el: HTMLElement, binding: DirectiveBinding<string>) => {
  el.style.color = binding.value
}
```

## 全局注册

```ts
// main.ts
const app = createApp(App)

app.directive('focus', {
  mounted: (el) => el.focus()
})

// 简写
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

## 对象字面量

传递多个值：

```vue-html
<div v-demo="{ color: 'white', text: 'hello' }">
```

```ts
const vDemo = (el: HTMLElement, binding: DirectiveBinding<{ color: string; text: string }>) => {
  console.log(binding.value.color) // 'white'
  console.log(binding.value.text)  // 'hello'
}
```

## 动态参数

```vue-html
<div v-my-directive:[dynamicArg]="value">
```

## 实际示例

### v-click-outside

```ts
const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
    el._clickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
}
```

### v-tooltip

```ts
const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.setAttribute('title', binding.value)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.setAttribute('title', binding.value)
  }
}
```

### v-permission

```ts
const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

## TypeScript：全局指令

```ts
// directives/highlight.ts
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface ComponentCustomProperties {
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

## 在组件上使用

⚠️ **不推荐** - 指令应用到根元素，对于多根组件可能不可预测。

```vue-html
<!-- 应用到 MyComponent 的根元素 -->
<MyComponent v-my-directive />
```

<!-- 
Source references:
- https://vuejs.org/guide/reusability/custom-directives.html
-->
