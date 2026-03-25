---
name: template-refs
description: 直接访问 DOM 元素和子组件实例
---

# 模板引用

模板引用提供对 DOM 元素和子组件实例的直接访问。

## 基本用法（3.5+）

使用 `useTemplateRef()` 实现类型安全的引用：

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

## 传统方式（3.5 之前）

使用同名 ref：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

## v-for 中的引用

将多个引用收集到数组中：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const items = ref([1, 2, 3])
const itemRefs = ref<HTMLLIElement[]>([])
</script>

<template>
  <ul>
    <li v-for="item in items" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

> 注意：ref 数组顺序不保证与源数组顺序一致。

## 函数式引用

使用函数以获得完全控制：

```vue
<script setup lang="ts">
const elements = new Map<number, HTMLElement>()

function setItemRef(el: HTMLElement | null, id: number) {
  if (el) {
    elements.set(id, el)
  } else {
    elements.delete(id)
  }
}
</script>

<template>
  <div v-for="item in items" :ref="(el) => setItemRef(el, item.id)">
    {{ item.name }}
  </div>
</template>
```

## 组件引用

访问子组件实例：

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

type ChildInstance = InstanceType<typeof Child>
const childRef = useTemplateRef<ChildInstance>('child')

onMounted(() => {
  // 访问暴露的属性/方法
  childRef.value?.someMethod()
})
</script>

<template>
  <Child ref="child" />
</template>
```

### 暴露组件属性

默认情况下，`<script setup>` 组件是封闭的。使用 `defineExpose`：

```vue
<!-- Child.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++

// 只有这些可以通过 ref 访问
defineExpose({
  count,
  increment
})
</script>
```

## 常见用例

### 焦点管理

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

function focusInput() {
  inputRef.value?.focus()
}
</script>
```

### 滚动控制

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const containerRef = useTemplateRef<HTMLDivElement>('container')

function scrollToBottom() {
  const el = containerRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}
</script>
```

### 第三方库集成

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
let chart: Chart | null = null

onMounted(() => {
  if (canvasRef.value) {
    chart = new Chart(canvasRef.value, {
      // 选项
    })
  }
})

onUnmounted(() => {
  chart?.destroy()
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
```

## 重要说明

1. **挂载前引用为 null** - 在 `onMounted` 或之后访问
2. **条件引用可能为 null** - 带有 `v-if` 的元素可能不存在
3. **使用可选链** - `ref.value?.method()` 以确保安全
4. **避免过度使用** - 尽可能优先使用声明式方法

<!-- 
Source references:
- https://vuejs.org/guide/essentials/template-refs.html
- https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs
-->
