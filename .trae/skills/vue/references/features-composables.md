---
name: composables
description: 使用 Composition API 封装和复用有状态的逻辑
---

# Composables

Composables 是使用 Composition API 封装和复用有状态逻辑的函数。

## 什么是 Composable？

一个 composable 是满足以下条件的函数：
- 使用 Composition API 函数（ref、computed、onMounted 等）
- 管理响应式状态
- 返回响应式状态和/或函数
- 按约定以 "use" 开头命名

## 基本示例

```ts
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

使用：

```vue
<script setup lang="ts">
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  鼠标：{{ x }}, {{ y }}
</template>
```

## 异步 Composable

处理异步数据获取：

```ts
// composables/useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  watchEffect(async () => {
    data.value = null
    error.value = null
    isLoading.value = true

    try {
      const response = await fetch(toValue(url))
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  })

  return { data, error, isLoading }
}
```

使用响应式 URL：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/composables/useFetch'

const userId = ref(1)
const { data, error, isLoading } = useFetch(() => `/api/users/${userId.value}`)

// 更改 userId 会触发重新获取
function nextUser() {
  userId.value++
}
</script>
```

## Composable 约定

### 命名

- 始终以 `use` 开头（useMouse、useFetch、useCounter）
- 使用 camelCase

### 输入参数

接受 ref 或 getter 以实现响应式：

```ts
import { toValue, type MaybeRefOrGetter } from 'vue'

function useFeature(input: MaybeRefOrGetter<string>) {
  // toValue 处理 ref、getter 或普通值
  const value = toValue(input)
  
  // 为了响应式追踪，在 watchEffect/computed 中调用 toValue
  watchEffect(() => {
    console.log(toValue(input))
  })
}
```

### 返回值

返回包含 ref 的普通对象（非 reactive）：

```ts
// ✅ 良好 - ref 可以被解构
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  
  return { count, increment }
}

// 使用 - 保持响应式
const { count, increment } = useCounter()
```

```ts
// ❌ 避免 - reactive 解构后会失去连接
export function useCounter() {
  const state = reactive({ count: 0 })
  return state
}

// 失去响应式
const { count } = useCounter()
```

## 组合 Composables

Composables 可以使用其他 composables：

```ts
// composables/useEventListener.ts
import { onMounted, onUnmounted, type MaybeRefOrGetter, toValue } from 'vue'

export function useEventListener(
  target: MaybeRefOrGetter<EventTarget>,
  event: string,
  callback: EventListener
) {
  onMounted(() => toValue(target).addEventListener(event, callback))
  onUnmounted(() => toValue(target).removeEventListener(event, callback))
}
```

```ts
// composables/useMouse.ts - 使用 useEventListener
import { ref } from 'vue'
import { useEventListener } from './useEventListener'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = (event as MouseEvent).pageX
    y.value = (event as MouseEvent).pageY
  })

  return { x, y }
}
```

## 副作用

### SSR 注意事项

仅在浏览器中运行 DOM 特定代码：

```ts
export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  onMounted(() => {
    // 仅在浏览器中运行
    width.value = window.innerWidth
    height.value = window.innerHeight
  })
  
  return { width, height }
}
```

### 清理

始终清理副作用：

```ts
export function useInterval(callback: () => void, delay: number) {
  const id = ref<number | undefined>()

  onMounted(() => {
    id.value = setInterval(callback, delay)
  })

  onUnmounted(() => {
    if (id.value) clearInterval(id.value)
  })
}
```

## 使用限制

Composables 必须在以下位置调用：
- 在 `<script setup>` 或 `setup()` 中同步调用
- 可以在生命周期钩子如 `onMounted()` 中调用

```ts
// ✅ 可以工作
<script setup>
const { x, y } = useMouse()
</script>

// ❌ 无法工作
setTimeout(() => {
  const { x, y } = useMouse() // 没有活动的组件
}, 100)
```

例外：`<script setup>` 允许在 `await` 之后调用 composables。

## 与其他模式对比

**vs Mixins**：Composables 是显式的（无命名冲突，来源清晰）

**vs 无渲染组件**：Composables 没有组件开销

**vs React Hooks**：概念类似，但 Vue 的响应式不同 - 没有关于 hook 顺序或依赖数组的规则

<!-- 
Source references:
- https://vuejs.org/guide/reusability/composables.html
-->
