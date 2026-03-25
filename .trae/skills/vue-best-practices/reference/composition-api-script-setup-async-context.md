---
title: Script Setup 中的顶层 await 保留组件上下文
impact: HIGH
impactDescription: 误解异步上下文会导致生命周期钩子和监听器静默失败
type: gotcha
tags: [vue3, composition-api, script-setup, async, await, suspense]
---

# Script Setup 中的顶层 await 保留组件上下文

**影响：高** - 在 `<script setup>` 中，顶层 `await` 语句保留组件上下文（允许在 `await` 之后使用生命周期钩子和监听器），但这是特殊情况。嵌套异步函数或回调失去上下文，导致生命周期钩子静默失败。

Vue 的编译器自动在 `<script setup>` 中每个顶层 await 后注入上下文恢复。这不适用于 `setup()` 函数或嵌套异步上下文。

## 任务清单

- [ ] 理解 `<script setup>` 中的顶层 await 是特殊处理的
- [ ] 永远不要在嵌套异步函数中注册生命周期钩子
- [ ] 使用 `<Suspense>` 使用异步 `<script setup>` 组件
- [ ] 在常规 `setup()` 中，永远不要在生命周期钩子注册前使用 await
- [ ] 同步注册钩子，然后在其中进行异步工作

**顶层 await 有效（仅限 script setup）：**
```vue
<script setup>
import { ref, onMounted, watch } from 'vue'

// 这是顶层 await - Vue 编译器保留上下文
const config = await fetchConfig()  // OK！

// 这些钩子有效因为 Vue 恢复了上下文
onMounted(() => {
  console.log('This will run!')  // 有效
})

watch(someRef, () => {
  console.log('This will track!')  // 有效
})

// 另一个顶层 await - 仍然 OK
const data = await fetchData(config.apiUrl)  // OK！

// 多个 await 后仍然有效
onMounted(() => {
  console.log('This also runs!')  // 有效
})
</script>

<!-- 重要：父级必须使用 Suspense -->
<template>
  <Suspense>
    <AsyncComponent />
  </Suspense>
</template>
```

**嵌套异步破坏上下文：**
```vue
<script setup>
import { ref, onMounted, watch } from 'vue'

// 错误：嵌套异步函数 - await 后失去上下文
async function initializeData() {
  const config = await fetchConfig()

  // BUG：这个钩子不会被注册！
  // 我们不再在同步 setup 上下文中
  onMounted(() => {
    console.log('This will NEVER run!')  // 静默失败
  })

  // BUG：这个监听器不会在卸载时自动清理
  watch(someRef, () => {
    console.log('Memory leak - not cleaned up!')
  })
}

// 调用异步函数
initializeData()  // 里面的钩子无效！

// 错误：回调也失去上下文
setTimeout(async () => {
  await delay(100)
  onMounted(() => {
    console.log('Never runs!')  // 静默失败
  })
}, 0)
</script>
```

**正确模式：**
```vue
<script setup>
import { ref, onMounted, watch } from 'vue'

const data = ref(null)
const config = ref(null)

// 正确：先同步注册钩子
onMounted(async () => {
  // 然后在钩子内部进行异步工作
  config.value = await fetchConfig()
  data.value = await fetchData(config.value.apiUrl)
})

// 正确：监听器同步注册
watch(config, async (newConfig) => {
  if (newConfig) {
    data.value = await fetchData(newConfig.apiUrl)
  }
})

// 或者对初始数据使用顶层 await
const initialConfig = await fetchConfig()  // OK - 顶层
config.value = initialConfig

onMounted(() => {
  console.log('Works!')  // 编译器保留上下文
})
</script>
```

**setup() 函数（不是 script setup）：**
```javascript
// 在常规 setup() 中，await 总是破坏上下文
export default {
  async setup() {
    const data = ref(null)

    // 错误：await 后的钩子不会注册
    const config = await fetchConfig()

    onMounted(() => {
      console.log('Never runs!')  // 静默失败！
    })

    return { data }
  }
}

// 正确：在任何 await 之前注册钩子
export default {
  async setup() {
    const data = ref(null)

    // 先注册钩子（同步）
    onMounted(async () => {
      const config = await fetchConfig()
      data.value = await fetchData(config)
    })

    // 现在如果需要可以 await
    // 但钩子必须在此点之前注册

    return { data }
  }
}
```

## 为什么会这样

```javascript
// Vue 在 setup 期间追踪"当前组件实例"
// 这就像一个全局变量，被设置和清除

// 在同步 setup 期间：
function setup() {
  currentInstance = this  // Vue 设置这个

  onMounted(cb)  // 使用 currentInstance 注册

  // await 后，JavaScript 在微任务中恢复
  await something()

  // currentInstance 现在是 null 或不同的！
  onMounted(cb)  // 找不到实例 - 静默失败
}

// <script setup> 编译器添加恢复：
// 每个 await 后，它注入：setCurrentInstance(savedInstance)
```

## Suspense 要求

```vue
<!-- 使用异步 script setup 时，父级需要 Suspense -->
<template>
  <Suspense>
    <!-- 带顶层 await 的异步组件 -->
    <AsyncChild />

    <!-- 可选：加载状态 -->
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

## 参考
- [Composition API FAQ - Async Setup](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composables - Async Without Await](https://antfu.me/posts/async-with-composition-api)
- [Suspense](https://vuejs.org/guide/built-ins/suspense.html)
