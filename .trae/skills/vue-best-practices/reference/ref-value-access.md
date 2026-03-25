---
title: 在 JavaScript 中访问 ref() 时始终使用 .value
impact: HIGH
impactDescription: 忘记使用 .value 会导致状态更新无法触发响应式的静默失败和错误
type: capability
tags: [vue3, reactivity, ref, composition-api]
---

# 在 JavaScript 中访问 ref() 时始终使用 .value

**影响：高** - 忘记使用 `.value` 会导致状态更新无法触发响应式的静默失败，从而产生难以调试的问题。

在 Vue 3 的 Composition API 中使用 `ref()` 时，响应式值被包装在一个对象中，在 JavaScript 代码中必须通过 `.value` 访问。然而，在模板中，Vue 会自动解包 ref，因此不需要使用 `.value`。这种不一致性是常见的错误来源。

## 任务清单

- [ ] 在 `<script>` 或 `.js`/`.ts` 文件中读取或写入 ref 值时始终使用 `.value`
- [ ] 在 `<template>` 中永远不要使用 `.value` - Vue 会自动解包 ref
- [ ] 将 refs 传递给函数时，决定是传递 ref 对象还是 `.value`
- [ ] 使用 IDE/TypeScript 尽早捕获缺少 `.value` 的错误

**错误示例：**
```javascript
import { ref } from 'vue'

const count = ref(0)

// 这些操作不会按预期工作
count++           // 尝试递增 ref 对象，而不是值
count = 5         // 重新赋值变量，失去响应式
console.log(count) // 输出 "[object Object]"，而不是数字

const items = ref([1, 2, 3])
items.push(4)     // 错误：push 不是函数
```

**正确示例：**
```javascript
import { ref } from 'vue'

const count = ref(0)

// 在 JavaScript 中始终使用 .value
count.value++           // 正确递增到 1
count.value = 5         // 正确将值设置为 5
console.log(count.value) // 输出 "5"

const items = ref([1, 2, 3])
items.value.push(4)     // 正确将 4 添加到数组
```

```vue
<template>
  <!-- 在模板中，不需要 .value - Vue 自动解包 -->
  <p>{{ count }}</p>
  <button @click="count++">递增</button>
</template>
```

## 参考
- [Vue.js 响应式基础 - ref()](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref)
