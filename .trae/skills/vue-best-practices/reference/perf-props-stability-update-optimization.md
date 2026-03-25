---
title: 保持 Props 稳定以最小化子组件重新渲染
impact: HIGH
impactDescription: 向列表项传递变化的 props 会导致所有子组件不必要地重新渲染
type: efficiency
tags: [vue3, performance, props, v-for, re-renders, optimization]
---

# 保持 Props 稳定以最小化子组件重新渲染

**影响：高** - 当传递给子组件的 props 变化时，Vue 必须重新渲染这些组件。将派生值如 `activeId` 传递给每个列表项会导致所有项在 activeId 变化时重新渲染，即使只有一项的 active 状态实际变化。

将比较逻辑移到父组件并传递布尔结果。这是 Vue 中最具影响力的更新性能优化之一。

## 任务清单

- [ ] 避免传递所有子组件都比较的父级状态（如 `activeId`）
- [ ] 在父组件中预计算派生布尔 props（如 `:active="item.id === activeId"`）
- [ ] 使用 Vue DevTools 分析重新渲染以识别 prop 稳定性问题
- [ ] 对大型列表特别考虑这种模式

**错误：**
```vue
<template>
  <!-- 错误：activeId 变化 -> 所有 100 个 ListItem 重新渲染 -->
  <ListItem
    v-for="item in list"
    :key="item.id"
    :id="item.id"
    :active-id="activeId"
  />
</template>

<script setup>
import { ref } from 'vue'

const list = ref([/* 100 项 */])
const activeId = ref(null)

// 当 activeId 从 1 变为 2 时：
// - ListItem 1 需要重新渲染（之前是 active，现在不是）
// - ListItem 2 需要重新渲染（之前不是 active，现在是）
// - 其他 98 个 ListItem 也因为 activeId prop 变化而重新渲染！
</script>
```

```vue
<!-- ListItem.vue - 接收 activeId 并在内部比较 -->
<template>
  <div :class="{ active: id === activeId }">
    {{ id }}
  </div>
</template>

<script setup>
defineProps({
  id: Number,
  activeId: Number  // 这个 prop 对所有项都变化
})
</script>
```

**正确：**
```vue
<template>
  <!-- 正确：只有 :active 实际变化的项才会重新渲染 -->
  <ListItem
    v-for="item in list"
    :key="item.id"
    :id="item.id"
    :active="item.id === activeId"
  />
</template>

<script setup>
import { ref } from 'vue'

const list = ref([/* 100 项 */])
const activeId = ref(null)

// 当 activeId 从 1 变为 2 时：
// - ListItem 1: :active 从 true 变为 false -> 重新渲染
// - ListItem 2: :active 从 false 变为 true -> 重新渲染
// - 其他 98 个 ListItem: :active 仍然是 false -> 不重新渲染！
</script>
```

```vue
<!-- ListItem.vue - 接收预计算的布尔值 -->
<template>
  <div :class="{ active }">
    {{ id }}
  </div>
</template>

<script setup>
defineProps({
  id: Number,
  active: Boolean  // 这只对真正变化的项变化
})
</script>
```

## 导致 Prop 不稳定的常见模式

```vue
<!-- 错误：传递可能偏移的索引 -->
<Item
  v-for="(item, index) in items"
  :key="item.id"
  :index="index"
  :total="items.length"  <!-- 列表变化时变化 -->
/>

<!-- 错误：传递整个选择集合 -->
<Item
  v-for="item in items"
  :key="item.id"
  :selected-ids="selectedIds"  <!-- 任何选择时所有项都重新渲染 -->
/>

<!-- 正确：预计算布尔值 -->
<Item
  v-for="item in items"
  :key="item.id"
  :selected="selectedIds.includes(item.id)"
/>
```

## 性能影响示例

| 场景 | Props 变化 | 组件重新渲染 |
|------|-----------|-------------|
| 100 项，传递 `activeId` | 100 | 100 (全部) |
| 100 项，传递 `:active` 布尔值 | 2 | 2 (仅变化的) |
| 1000 项，传递 `activeId` | 1000 | 1000 (全部) |
| 1000 项，传递 `:active` 布尔值 | 2 | 2 (仅变化的) |

## 参考
- [Vue.js 性能 - Props 稳定性](https://vuejs.org/guide/best-practices/performance.html#props-stability)
