---
name: lifecycle-hooks
description: 在组件生命周期的特定阶段运行代码
---

# 生命周期钩子

在组件生命周期的特定阶段执行代码。

## 常用生命周期钩子

```vue
<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

// DOM 挂载前
onBeforeMount(() => {
  console.log('before mount')
})

// DOM 挂载后（最常用）
onMounted(() => {
  console.log('mounted')
  // 可以安全访问 DOM、发起 API 调用、启动定时器
})

// 响应式状态变更导致重新渲染前
onBeforeUpdate(() => {
  console.log('before update')
})

// DOM 重新渲染后
onUpdated(() => {
  console.log('updated')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('before unmount')
})

// 组件卸载后
onUnmounted(() => {
  console.log('unmounted')
  // 清理：移除监听器、取消定时器等
})
</script>
```

## 生命周期图示

```
创建：
  setup() → onBeforeMount → onMounted

更新：
  onBeforeUpdate → onUpdated

销毁：
  onBeforeUnmount → onUnmounted
```

## 常见模式

### DOM 访问

```ts
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  // DOM 已可用
  inputRef.value?.focus()
})
```

### API 调用

```ts
import { ref, onMounted } from 'vue'

const data = ref(null)

onMounted(async () => {
  const response = await fetch('/api/data')
  data.value = await response.json()
})
```

### 清理

```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

### 定时器清理

```ts
import { onMounted, onUnmounted } from 'vue'

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    // ...
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
```

## 较少使用的钩子

```ts
import {
  onActivated,      // 被 keep-alive 的组件被激活
  onDeactivated,    // 被 keep-alive 的组件被停用
  onErrorCaptured,  // 捕获到来自后代的错误
  onRenderTracked,  // 调试：响应式依赖被追踪
  onRenderTriggered // 调试：重新渲染被触发
} from 'vue'
```

## SSR 钩子

```ts
import { onServerPrefetch } from 'vue'

// 仅在服务端渲染期间运行
onServerPrefetch(async () => {
  data.value = await fetchData()
})
```

## 重要说明

1. **钩子必须在 `setup()` 中同步调用**：

```ts
// ❌ 无法工作
setTimeout(() => {
  onMounted(() => {})
}, 100)

// ✅ 可以工作
onMounted(() => {
  setTimeout(() => {}, 100)
})
```

2. **可以从外部函数调用**，如果在 setup 中同步调用：

```ts
// composable.ts
export function useFeature() {
  onMounted(() => {
    // 如果在 setup 中同步调用 useFeature，这会正常工作
  })
}
```

3. **允许多次调用** - 所有回调都会被执行：

```ts
onMounted(() => console.log('first'))
onMounted(() => console.log('second'))
// 两者都会运行
```

<!-- 
Source references:
- https://vuejs.org/guide/essentials/lifecycle.html
- https://vuejs.org/api/composition-api-lifecycle.html
-->
