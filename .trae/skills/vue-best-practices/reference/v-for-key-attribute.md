---
title: 始终在 v-for 循环中提供唯一的 key
impact: HIGH
impactDescription: 缺失或不当的 key 会导致列表项具有状态、组件或动画时出现难以调试的错误
type: gotcha
tags: [vue3, v-for, list-rendering, key, state, components]
---

# 始终在 v-for 循环中提供唯一的 key

**影响：高** - 没有适当的 key，Vue 无法在列表变化时追踪元素身份。这会导致组件状态丢失、动画不正确、表单输入值在项之间跳转，以及极难调试的错误。

`key` 属性告诉 Vue 你的数据如何与它渲染的 DOM 元素相关联。当数据排序变化（通过排序、过滤、添加或删除）时，Vue 使用 key 来确定要更新、移除或创建什么。没有唯一的 key，Vue 会就地复用 DOM 元素，这可能导致一个项的状态错误地出现在另一个项上。

## 任务清单

- [ ] 始终使用唯一、稳定的标识符提供 `:key`（数据库 ID、UUID）
- [ ] 永远不要使用数组索引作为 key - 添加/删除项时索引会变化
- [ ] 只使用原始值（字符串或数字）- 永远不要使用对象作为 key
- [ ] 在 `<template v-for>` 上，将 key 放在 `<template>` 标签本身上（Vue 3 变化）
- [ ] 在 v-for 中使用组件时，key 是必需的，不是可选的

**错误示例：**
```html
<!-- 错误：没有提供 key -->
<li v-for="item in items">{{ item.name }}</li>

<!-- 错误：使用数组索引作为 key - 列表变化时会变化 -->
<li v-for="(item, index) in items" :key="index">
  <input v-model="item.value" />
</li>

<!-- 错误：使用对象作为 key -->
<li v-for="item in items" :key="item">{{ item.name }}</li>

<!-- 错误（Vue 3）：key 在子元素上而不是 template 上 -->
<template v-for="item in items">
  <li :key="item.id">{{ item.name }}</li>
</template>
```

```javascript
// 错误演示：使用索引作为 key
// 初始：['Alice', 'Bob', 'Charlie'] 在索引 [0, 1, 2]
// 删除 'Bob' 后：['Alice', 'Charlie'] 在索引 [0, 1]
// Charlie 现在有索引 1，所以 Vue 为 Charlie 复用 Bob 的 DOM/组件状态！
```

**正确示例：**
```html
<!-- 正确：唯一标识符作为 key -->
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

<!-- 正确：与组件一起使用 -->
<MyComponent
  v-for="item in items"
  :key="item.id"
  :item="item"
/>

<!-- 正确（Vue 3）：key 在 template 标签上 -->
<template v-for="item in items" :key="item.id">
  <li>{{ item.name }}</li>
  <span>{{ item.description }}</span>
</template>

<!-- 正确：与有状态元素一起使用 -->
<div v-for="user in users" :key="user.id">
  <input v-model="user.email" />
  <select v-model="user.role">
    <option value="admin">管理员</option>
    <option value="user">用户</option>
  </select>
</div>
```

## 何时 Key 是关键的

当 v-for 循环包含以下内容时，key 是绝对必需的：
- 具有本地状态的组件
- 表单元素（`<input>`、`<select>`、`<textarea>`）
- 具有初始化逻辑的元素（mounted/created 钩子）
- 动画或过渡
- 直接 DOM 操作

## 参考
- [Vue.js 列表渲染 - Key](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)
- [Vue 3 迁移指南 - Template 上的 Key](https://v3-migration.vuejs.org/breaking-changes/key-attribute)
