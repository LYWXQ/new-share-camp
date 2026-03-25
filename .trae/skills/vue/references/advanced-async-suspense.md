---
name: async-components-suspense
description: 处理异步操作、顶层 await 和 Suspense 边界
---

# 异步组件与 Suspense

Vue 提供了在组件中处理异步操作的模式。

## Script Setup 中的顶层 await

`<script setup>` 支持顶层 `await`，使组件成为异步依赖：

```vue
<script setup lang="ts">
const data = await fetch('/api/data').then(r => r.json())
</script>

<template>
  <div>{{ data }}</div>
</template>
```

**重要**：带有顶层 `await` 的组件**需要在父组件中有 `<Suspense>` 边界**，否则无法渲染。

## Suspense

`<Suspense>` 是一个内置组件，用于处理组件树中的异步依赖。

```vue
<template>
  <Suspense>
    <!-- 带有异步 setup 的组件 -->
    <AsyncComponent />
    
    <!-- 加载时的回退内容 -->
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### Suspense 插槽

- **default**：要渲染的异步内容
- **fallback**：异步依赖解析时显示的内容

```vue
<Suspense>
  <template #default>
    <Dashboard />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

## 异步组件

定义异步加载的组件：

```ts
import { defineAsyncComponent } from 'vue'

const AsyncModal = defineAsyncComponent(() => 
  import('./components/Modal.vue')
)

// 带选项
const AsyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./components/Modal.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,        // 显示加载前的延迟（毫秒）
  timeout: 3000      // 显示错误前的超时（毫秒）
})
```

## 常见的异步陷阱

### 陷阱 1：缺少 Suspense 边界

```vue
<!-- ❌ 无法工作 - 没有 Suspense 边界 -->
<template>
  <AsyncComponent />
</template>

<!-- ✅ 可以工作 -->
<template>
  <Suspense>
    <AsyncComponent />
    <template #fallback>加载中...</template>
  </Suspense>
</template>
```

### 陷阱 2：await 之后的生命周期钩子

生命周期钩子必须同步注册，在任何 `await` 之前：

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// ✅ 在 await 之前注册钩子
onMounted(() => console.log('mounted'))
onUnmounted(() => console.log('unmounted'))

// 现在可以 await
const data = await fetchData()
</script>
```

```vue
<script setup lang="ts">
// ❌ 错误 - await 之后的钩子无法工作
const data = await fetchData()

onMounted(() => {
  // 这可能不会被调用！
})
</script>
```

### 陷阱 3：await 之后的 Composables

使用生命周期钩子的 composables 必须在 `await` 之前调用：

```vue
<script setup lang="ts">
import { useMouse } from '@/composables/useMouse'

// ✅ 在 await 之前调用 composables
const { x, y } = useMouse()

const data = await fetchData()
</script>
```

### 陷阱 4：在异步回调中创建的侦听器

异步回调中的侦听器不会自动清理：

```ts
// ❌ 内存泄漏 - 侦听器不会自动清理
setTimeout(() => {
  watch(source, callback) // 必须手动停止
}, 1000)

// ✅ setup 中的侦听器会自动清理
watch(source, callback)
```

## 推荐模式：避免顶层 await

通常更好的做法是在 `onMounted` 或使用侦听器中处理异步：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const data = ref<Data | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

onMounted(async () => {
  try {
    data.value = await fetchData()
  } catch (e) {
    error.value = e as Error
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">加载中...</div>
  <div v-else-if="error">错误：{{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

这种模式：
- 不需要 Suspense
- 可以控制加载/错误状态
- 在任何地方都能工作，无需特殊的父组件设置

## 何时使用 Suspense

使用 Suspense 的场景：
- 有嵌套的异步组件
- 希望在多个异步子组件间协调加载状态
- 进行 SSR 且有异步数据需求

避免使用 Suspense 的场景：
- 简单的单组件异步加载
- 需要细粒度控制加载状态
- 希望避免 Suspense 的复杂性

## Suspense 事件

```vue
<Suspense
  @pending="onPending"
  @resolve="onResolve"
  @fallback="onFallback"
>
  <AsyncComponent />
</Suspense>
```

## Suspense 的错误处理

使用 `onErrorCaptured` 或 `<ErrorBoundary>` 模式：

```vue
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((e) => {
  error.value = e
  return false // 阻止传播
})
</script>

<template>
  <div v-if="error">错误：{{ error.message }}</div>
  <Suspense v-else>
    <AsyncComponent />
    <template #fallback>加载中...</template>
  </Suspense>
</template>
```

<!-- 
Source references:
- https://vuejs.org/guide/built-ins/suspense.html
- https://vuejs.org/guide/components/async.html
- https://vuejs.org/api/sfc-script-setup.html#top-level-await
-->
