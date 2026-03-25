---
title: 只在 Setup 上下文中同步调用可组合函数
影响: 高
影响描述: 在 setup 上下文外部或异步调用可组合函数会导致生命周期钩子注册失败并可能造成内存泄漏
type: gotcha
tags: [vue3, composables, composition-api, setup, async, lifecycle]
---

# 只在 Setup 上下文中同步调用可组合函数

**影响：高** - 可组合函数必须在 `<script setup>`、`setup()` 函数或生命周期钩子中同步调用。在回调中异步调用可组合函数（await 之后）或在组件上下文外部调用会阻止 Vue 将生命周期钩子与组件实例关联，导致静默失败。

这很关键，因为可组合函数经常在内部注册 `onMounted` 和 `onUnmounted` 钩子。如果在错误的上下文中调用，这些钩子永远不会被注册，导致状态未初始化或内存泄漏。

## 任务清单

- [ ] 在 `<script setup>` 或 `setup()` 的顶层调用所有可组合函数
- [ ] 永远不要在异步回调、setTimeout 或 Promise.then 中调用可组合函数
- [ ] 永远不要有条件地（if/else）调用可组合函数 - 无条件调用并在内部处理条件
- [ ] 永远不要在循环中调用可组合函数 - 重构为使用数组数据调用一次
- [ ] 例外：可组合函数可以在生命周期钩子如 `onMounted` 中调用

**错误：**
```vue
<script setup>
import { useFetch } from './composables/useFetch'
import { useAuth } from './composables/useAuth'

// 错误：await 后调用可组合函数
const config = await loadConfig()
const { data } = useFetch(config.apiUrl)  // 生命周期钩子不会注册！

// 错误：有条件地调用可组合函数
if (someCondition) {
  const { user } = useAuth()  // 钩子注册不一致！
}

// 错误：在回调中调用可组合函数
setTimeout(() => {
  const { data } = useFetch('/api/delayed')  // 没有组件上下文！
}, 1000)

// 错误：在循环中调用可组合函数
for (const url of urls) {
  const { data } = useFetch(url)  // 错误地创建多个实例
}
</script>
```

**正确：**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from './composables/useFetch'
import { useAuth } from './composables/useAuth'

// 正确：在顶层同步调用可组合函数
const { user, isAuthenticated } = useAuth()
const apiUrl = ref('/api/default')
const { data, execute } = useFetch(apiUrl)

// 不同地处理异步配置加载
onMounted(async () => {
  const config = await loadConfig()
  apiUrl.value = config.apiUrl  // 更新 ref，可组合函数响应
})

// 正确：在内部处理条件，而不是外部
const showUserData = computed(() => isAuthenticated.value && someCondition)

// 正确：对于多个 URL，使用不同的模式
const urls = ref(['/api/a', '/api/b', '/api/c'])
const results = ref([])

// 在 onMounted 中获取或使用为数组设计的可组合函数
onMounted(async () => {
  results.value = await Promise.all(urls.value.map(url => fetch(url)))
})
</script>
```

## 例外：在生命周期钩子中调用

可组合函数可以在生命周期钩子中调用，因为 Vue 维护组件上下文：

```vue
<script setup>
import { onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'

// 正确：在生命周期钩子中调用 - 组件上下文可用
onMounted(() => {
  // 这有效因为我们在组件的执行上下文中
  useEventListener(document, 'visibilitychange', handleVisibility)
})
</script>
```

## 特殊情况：`<script setup>` 中的异步 Setup

`<script setup>` 中的顶层 await 是特殊的 - Vue 的编译器自动保留上下文：

```vue
<script setup>
import { useFetch } from './composables/useFetch'

// 正确：`<script setup>` 中的顶层 await 保留上下文
// Vue 编译器特殊处理这个
const config = await loadConfig()
const { data } = useFetch(config.apiUrl)  // 这有效！

// 但嵌套的 await 仍然破坏上下文：
async function initLater() {
  await delay(1000)
  const { data } = useFetch('/api/late')  // 错误：这无效！
}
</script>
```

## 为什么这很重要

当你调用可组合函数时，Vue 需要知道将其与哪个组件实例关联。这种关联通过仅在同步 setup 执行期间设置的内部"当前实例"发生。

```javascript
// 在可组合函数内部
export function useFetch(url) {
  const data = ref(null)

  // 这些需要当前组件实例！
  onMounted(() => { /* ... */ })
  onUnmounted(() => { /* cleanup */ })

  // 如果在 setup 上下文外部调用，Vue 找不到实例
  // 这些钩子被静默忽略
  return { data }
}
```

## 参考
- [Vue.js Composables - Usage Restrictions](https://vuejs.org/guide/reusability/composables.html#usage-restrictions)
- [Vue.js Composition API - Setup Context](https://vuejs.org/api/composition-api-setup.html)
