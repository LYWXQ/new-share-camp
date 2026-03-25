---
title: 使用计算属性进行缓存的响应式派生
impact: MEDIUM
impactDescription: 方法在每次渲染时重新计算，而计算属性会缓存结果
type: efficiency
tags: [vue3, computed, methods, performance, caching]
---

# 使用计算属性进行缓存的响应式派生

**影响：中** - 计算属性基于其响应式依赖进行缓存，只在依赖项变化时重新求值。方法在每次组件重新渲染时运行，对昂贵操作造成性能问题。

当你需要从响应式状态派生值时，优先使用计算属性而不是方法，以获得自动缓存和优化的重新渲染。

## 任务清单

- [ ] 使用计算属性获取从响应式状态派生的值
- [ ] 只在需要传递参数或不需要缓存时使用方法
- [ ] 永远不要对非响应式值（如 `Date.now()`）使用计算属性
- [ ] 考虑方法 vs 计算属性中昂贵操作的性能影响

**错误示例：**
```vue
<template>
  <!-- 错误：方法在每次重新渲染时运行 -->
  <p>{{ getFilteredItems() }}</p>
  <p>{{ calculateTotal() }}</p>
  <p>{{ getCurrentTime() }}</p>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([/* 大型数组 */])
const prices = ref([100, 200, 300])

// 错误：昂贵操作在每次渲染时运行
function getFilteredItems() {
  return items.value
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
}

// 错误：即使价格未变化，每次渲染都运行计算
function calculateTotal() {
  return prices.value.reduce((sum, price) => sum + price, 0)
}

// 这看起来像是计算属性的用例，但 Date.now() 是非响应式的
function getCurrentTime() {
  return Date.now()  // 看起来有效但不会响应式更新
}
</script>
```

**正确示例：**
```vue
<template>
  <!-- 正确：计算属性只在 items 变化时重新计算 -->
  <p>{{ filteredItems }}</p>
  <p>{{ total }}</p>
  <!-- 正确：对非响应式当前时间使用方法 -->
  <p>{{ getCurrentTime() }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([/* 大型数组 */])
const prices = ref([100, 200, 300])

// 正确：缓存 - 只在 items.value 变化时重新计算
const filteredItems = computed(() => {
  return items.value
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
})

// 正确：缓存 - 只在价格变化时重新计算
const total = computed(() => {
  return prices.value.reduce((sum, price) => sum + price, 0)
})

// 正确：对非响应式值使用方法
// （或使用 setInterval 更新 ref）
function getCurrentTime() {
  return Date.now()
}
</script>
```

## 何时使用每种

| 场景 | 使用计算属性 | 使用方法 |
|------|-------------|----------|
| 从响应式状态派生 | 是 | 否 |
| 昂贵计算 | 是 | 否 |
| 需要传递参数 | 否 | 是 |
| 非响应式值 (Date.now()) | 否 | 是 |
| 不需要缓存 | 否 | 是 |
| 由用户操作触发 | 否 | 是 |

## 非响应式值警告

计算属性只追踪响应式依赖。非响应式值如 `Date.now()` 会导致计算属性只被求值一次且永不更新：

```javascript
// 错误：Date.now() 不是响应式的 - 计算属性永远不会更新
const now = computed(() => Date.now())

// 正确：使用带有 setInterval 的 ref 获取实时时间
const now = ref(Date.now())
setInterval(() => {
  now.value = Date.now()
}, 1000)
```

## 参考
- [Vue.js 计算属性 - 计算属性缓存 vs 方法](https://vuejs.org/guide/essentials/computed.html#computed-caching-vs-methods)
