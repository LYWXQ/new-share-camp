---
title: 模板表达式必须是单个表达式
impact: MEDIUM
impactDescription: 在模板中使用语句而不是表达式会导致编译错误
type: capability
tags: [vue3, template, expressions, interpolation, syntax]
---

# 模板表达式必须是单个表达式

**影响：中** - Vue 模板只支持单个 JavaScript 表达式，不支持语句。使用变量声明、if 语句或多行代码块将导致模板编译错误。

模板插值 `{{ }}` 和指令绑定求值产生值的 JavaScript 表达式。不允许使用 `if`、`for`、变量声明或多行代码块等语句。

## 任务清单

- [ ] 在 `{{ }}` 插值中只使用单个表达式
- [ ] 使用三元运算符代替 if/else 语句
- [ ] 将复杂逻辑移到计算属性或方法中
- [ ] 避免在模板中声明变量
- [ ] 使用 `v-if`/`v-else` 指令进行条件渲染

**错误示例：**
```vue
<template>
  <!-- 错误：变量声明是语句，不是表达式 -->
  <p>{{ var greeting = 'Hello' }}</p>
  <p>{{ let x = 1 }}</p>
  <p>{{ const name = 'Vue' }}</p>

  <!-- 错误：不允许使用 if 语句 -->
  <p>{{ if (ok) { return message } }}</p>
  <p>{{ if (user) return user.name }}</p>

  <!-- 错误：不允许使用多个语句 -->
  <p>{{ count++; return count }}</p>
  <p>{{ items.push(newItem); items.length }}</p>

  <!-- 错误：不允许使用 for/while 循环 -->
  <p>{{ for (let i = 0; i < 5; i++) { } }}</p>
</template>
```

**正确示例：**
```vue
<template>
  <!-- 可以：简单表达式 -->
  <p>{{ message }}</p>
  <p>{{ count + 1 }}</p>
  <p>{{ items.length }}</p>

  <!-- 可以：用于条件的三元运算符 -->
  <p>{{ ok ? 'YES' : 'NO' }}</p>
  <p>{{ user ? user.name : 'Guest' }}</p>
  <p>{{ score >= 60 ? 'Pass' : 'Fail' }}</p>

  <!-- 可以：方法/函数调用 -->
  <p>{{ formatDate(date) }}</p>
  <p>{{ items.filter(i => i.active).length }}</p>

  <!-- 可以：链式表达式 -->
  <p>{{ message.split('').reverse().join('') }}</p>

  <!-- 可以：模板字符串 -->
  <p>{{ `Hello, ${name}!` }}</p>

  <!-- 可以：对象/数组表达式 -->
  <p>{{ { name: 'Vue', version: 3 } }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const ok = ref(true)
const message = ref('Hello')
const user = ref({ name: 'Alice' })
const score = ref(85)

// 将复杂逻辑移到计算属性
const greeting = computed(() => {
  if (user.value) {
    return `Welcome back, ${user.value.name}!`
  }
  return 'Hello, Guest!'
})

// 或使用方法处理可复用逻辑
function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
</script>
```

## 使用指令进行控制流

```vue
<template>
  <!-- 代替表达式中的 if/else，使用 v-if/v-else -->
  <p v-if="user">Welcome, {{ user.name }}!</p>
  <p v-else>Please log in</p>

  <!-- 代替表达式中的循环，使用 v-for -->
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>

  <!-- 不从 DOM 移除的条件显示 -->
  <p v-show="isVisible">This toggles visibility</p>
</template>
```

## 参考
- [Vue.js 模板语法 - 使用 JavaScript 表达式](https://vuejs.org/guide/essentials/template-syntax.html#using-javascript-expressions)
- [Vue.js 条件渲染](https://vuejs.org/guide/essentials/conditional.html)
