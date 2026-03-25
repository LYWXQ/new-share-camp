---
title: Script Setup 中的变量默认不是响应式的
impact: HIGH
impactDescription: 忘记用 ref() 或 reactive() 包装变量会导致 script setup 中的静默响应式失败
type: gotcha
tags: [vue3, sfc, script-setup, reactivity, ref, composition-api]
---

# Script Setup 中的变量默认不是响应式的

**影响：高** - 与自动使属性响应式的 Options API 的 `data()` 不同，在 `<script setup>` 中声明的变量是普通 JavaScript 值。你必须显式使用 `ref()` 或 `reactive()` 使它们响应式。忘记这一点会导致值变化时 UI 不更新。

## 任务清单

- [ ] 始终用 `ref()` 包装原始值（字符串、数字、布尔值）
- [ ] 当你不需要重新赋值整个对象时，对对象使用 `reactive()`
- [ ] 记住在 script 中访问 refs 时使用 `.value`（模板中不需要）
- [ ] 对派生响应式状态使用 `computed()`，而不是普通函数

**问题代码：**
```vue
<script setup>
// 错误：这些不是响应式的！
let count = 0
let message = 'Hello'
let user = { name: 'John', age: 30 }

function increment() {
  count++  // 这个变化不会更新 UI！
}

function updateMessage() {
  message = 'World'  // UI 不会反映这个变化！
}
</script>

<template>
  <div>
    <!-- 将始终显示初始值 -->
    <p>Count: {{ count }}</p>
    <p>Message: {{ message }}</p>
    <button @click="increment">递增</button>
    <button @click="updateMessage">更新</button>
  </div>
</template>
```

**正确代码：**
```vue
<script setup>
import { ref, reactive, computed } from 'vue'

// 正确：原始值用 ref() 包装
const count = ref(0)
const message = ref('Hello')

// 正确：对象用 reactive()
const user = reactive({ name: 'John', age: 30 })

// 正确：派生状态用 computed
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++  // 在 script 中对 refs 使用 .value
}

function updateMessage() {
  message.value = 'World'
}

function updateUser() {
  user.name = 'Jane'  // 响应式对象不需要 .value
}
</script>

<template>
  <div>
    <!-- 模板中不需要 .value - Vue 自动解包 -->
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <p>Message: {{ message }}</p>
    <p>User: {{ user.name }}</p>
    <button @click="increment">递增</button>
  </div>
</template>
```

## 常见错误：普通计算

```vue
<script setup>
import { ref } from 'vue'

const items = ref([1, 2, 3, 4, 5])

// 错误：普通函数，不是响应式的 - items 变化时不会更新
const total = items.value.reduce((sum, n) => sum + n, 0)

// 错误：箭头函数 - 重新计算但 Vue 不追踪它
const getTotal = () => items.value.reduce((sum, n) => sum + n, 0)
</script>

<template>
  <!-- total 从不更新，getTotal 有效但不是最优的 -->
  <p>Total: {{ total }}</p>
</template>
```

```vue
<script setup>
import { ref, computed } from 'vue'

const items = ref([1, 2, 3, 4, 5])

// 正确：computed() 追踪依赖并缓存结果
const total = computed(() => items.value.reduce((sum, n) => sum + n, 0))
</script>

<template>
  <p>Total: {{ total }}</p>  <!-- items 变化时更新 -->
</template>
```

## 何时使用 ref() vs reactive()

```vue
<script setup>
import { ref, reactive } from 'vue'

// 对以下使用 ref()：
// - 原始值（字符串、数字、布尔值）
// - 你可能需要完全重新赋值的值
const count = ref(0)
const isLoading = ref(false)
const selectedId = ref<number | null>(null)

// 对以下使用 reactive()：
// - 你会变更但不会重新赋值的对象/数组
// - 当你想避免 .value 时
const form = reactive({
  name: '',
  email: '',
  errors: []
})

// 注意：不能重新赋值响应式对象
const user = reactive({ name: 'John' })
// user = { name: 'Jane' }  // 这会破坏响应式！
// user.name = 'Jane'       // 这有效

// 如果你需要重新赋值对象，使用 ref()
const userData = ref({ name: 'John' })
userData.value = { name: 'Jane' }  // 这有效
</script>
```

## 模板自动解包

Vue 自动在模板中解包 refs：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const user = ref({ name: 'John' })
</script>

<template>
  <!-- 所有这些都有效 - 不需要 .value -->
  <p>{{ count }}</p>
  <p>{{ user.name }}</p>
  <input v-model="count" type="number">
  <button @click="count++">递增</button>
</template>
```

但在内联编写的事件处理程序中，你可能仍然需要 `.value`：

```vue
<template>
  <!-- 这有效（Vue 处理它） -->
  <button @click="count++">+1</button>

  <!-- 对于复杂逻辑，可能需要 .value -->
  <button @click="() => { count.value = Math.max(0, count.value - 1) }">
    -1 (最小 0)
  </button>
</template>
```

## 参考
- [Vue.js 响应式基础](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue.js ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue.js reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
