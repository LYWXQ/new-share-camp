---
title: 根据依赖控制需求选择 watch vs watchEffect
impact: MEDIUM
impactDescription: 错误的选择会导致不必要的重新运行或遗漏依赖项追踪
type: efficiency
tags: [vue3, watch, watchEffect, watchers, reactivity, best-practices]
---

# 根据依赖控制需求选择 watch vs watchEffect

**影响：中** - 在 `watchEffect` 更简洁时使用 `watch` 会导致重复代码。在需要 `watch` 时使用 `watchEffect` 可能导致意外的重新运行或遗漏依赖项（尤其是异步情况）。

在回调使用与应该触发它的相同状态的简单情况下使用 `watchEffect`。当你需要精确控制什么触发回调、访问旧值或延迟执行时，使用 `watch`。

## 任务清单

- [ ] 当回调逻辑使用与应该响应它的相同状态时使用 `watchEffect`
- [ ] 当你需要旧值比较时使用 `watch`
- [ ] 当你需要延迟执行（非立即）时使用 `watch`
- [ ] 对带有 await 后依赖的异步回调使用 `watch`
- [ ] 当回调不应在初始挂载时运行时使用 `watch`

## 对比表

| 特性 | `watch` | `watchEffect` |
|------|---------|---------------|
| 依赖追踪 | 显式（你指定） | 自动（使用访问的属性） |
| 默认延迟 | 是（只在变化时运行） | 否（立即运行） |
| 访问旧值 | 是 | 否 |
| 异步依赖追踪 | 完全控制 | 只在第一次 await 之前 |
| 多个源 | 数组语法 | 自动 |

**优先使用 `watchEffect` 的情况：**
```vue
<script setup>
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

// 正确：当回调使用相同状态时 watchEffect 更简洁
watchEffect(async () => {
  const response = await fetch(
    `https://api.example.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
</script>
```

**优先使用 `watch` 的情况：**
```vue
<script setup>
import { ref, watch } from 'vue'

const todoId = ref(1)
const data = ref(null)

// 使用 watch 更好的情况：

// 1. 你需要旧值
watch(todoId, (newId, oldId) => {
  console.log(`从 ${oldId} 变更为 ${newId}`)
})

// 2. 你不想要立即执行
watch(todoId, () => {
  // 只在 todoId 变化时运行，不在挂载时运行
  fetchData()
})

// 3. 你在 await 后有依赖
watch(todoId, async (id) => {
  const response = await fetch(`/api/todos/${id}`)
  // 这里更多的响应式访问仍然正确触发
  // 因为我们显式指定了 todoId 作为源
})
</script>
```

## 使用 watchEffect 避免冗余代码

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const category = ref('all')
const results = ref([])

// 错误：重复 - 在源和使用中列出相同的依赖
watch(
  [searchQuery, category],
  ([query, cat]) => {
    fetchResults(query, cat)  // 相同的变量重复
  }
)

// 正确：watchEffect 消除重复
watchEffect(() => {
  fetchResults(searchQuery.value, category.value)
})
</script>
```

## 使用 watch 实现延迟行为

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const userId = ref(null)

// 错误：即使 userId 为 null 也立即运行
watchEffect(() => {
  if (userId.value) {
    loadUserProfile(userId.value)
  }
})

// 正确：只在 userId 实际变化时运行
watch(userId, (id) => {
  if (id) {
    loadUserProfile(id)
  }
})

// 也可以：使用 immediate 的 watch 当你需要两种行为
watch(
  userId,
  (id) => {
    if (id) loadUserProfile(id)
  },
  { immediate: true }  // 显式立即运行
)
</script>
```

## 使用 watch 进行旧值比较

```vue
<script setup>
import { ref, watch } from 'vue'

const status = ref('pending')

// 只有 watch() 提供旧值
watch(status, (newStatus, oldStatus) => {
  if (oldStatus === 'pending' && newStatus === 'approved') {
    showApprovalNotification()
  }

  if (oldStatus === 'approved' && newStatus === 'rejected') {
    showRejectionWarning()
  }
})
</script>
```

## 使用 watch 处理复杂的异步依赖

```vue
<script setup>
import { ref, watch } from 'vue'

const filters = ref({ status: 'active', sort: 'date' })
const page = ref(1)
const results = ref([])

// 更好：对异步使用显式源的 watch
// 无论 await 放在哪里，所有依赖都被正确追踪
watch(
  [filters, page],
  async ([currentFilters, currentPage]) => {
    const data = await fetchWithFilters(currentFilters)

    // 这些仍然被正确追踪：
    results.value = paginateResults(data, currentPage)
  },
  { deep: true }
)
</script>
```

## 参考
- [Vue.js 监听器 - watch vs. watchEffect](https://vuejs.org/guide/essentials/watchers.html#watch-vs-watcheffect)
