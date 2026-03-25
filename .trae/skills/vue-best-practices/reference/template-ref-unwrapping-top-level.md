---
title: 模板 Ref 解包只对顶层属性有效
impact: MEDIUM
impactDescription: 模板表达式中的嵌套 refs 渲染为 [object Object] 而不是它们的值
type: capability
tags: [vue3, reactivity, ref, template, unwrapping]
---

# 模板 Ref 解包只对顶层属性有效

**影响：中** - Vue 只在模板渲染上下文中自动解包作为顶层属性的 refs。嵌套 refs（对象内部的 refs）在表达式中不会自动解包，导致渲染为 `[object Object]` 或计算错误。

当在响应式对象或普通对象中存储 refs 并尝试在模板表达式中使用它们时，这个注意事项会让开发者困惑，比如 `{{ object.count + 1 }}`。

## 任务清单

- [ ] 将 refs 保持在 setup 返回或 script setup 的顶层
- [ ] 在模板中使用前将嵌套 refs 解构为顶层变量
- [ ] 注意文本插值 `{{ object.ref }}` 确实会解包，但表达式 `{{ object.ref + 1 }}` 不会
- [ ] 考虑重构数据以避免模板中的嵌套 refs

**错误示例：**
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const object = { id: ref(1) }
</script>

<template>
  <!-- 错误：表达式中的嵌套 ref 不会解包 -->
  <p>ID + 1 = {{ object.id + 1 }}</p>
  <!-- 渲染为："ID + 1 = [object Object]1" -->

  <!-- 令人惊讶的是，纯插值确实有效 -->
  <p>ID = {{ object.id }}</p>
  <!-- 渲染为："ID = 1"（因为它是最终表达式而被解包） -->
</template>
```

**正确示例：**
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const object = { id: ref(1) }

// 解决方案 1：解构到顶层
const { id } = object
</script>

<template>
  <!-- 正确：顶层 ref 在所有表达式中解包 -->
  <p>Count + 1 = {{ count + 1 }}</p>
  <!-- 渲染为："Count + 1 = 1" -->

  <!-- 正确：解构后的 ref 现在是顶层 -->
  <p>ID + 1 = {{ id + 1 }}</p>
  <!-- 渲染为："ID + 1 = 2" -->
</template>
```

```vue
<script setup>
import { ref, computed } from 'vue'

const object = { id: ref(1) }

// 解决方案 2：使用计算属性获取派生值
const idPlusOne = computed(() => object.id.value + 1)
</script>

<template>
  <!-- 正确：计算属性处理 .value 访问 -->
  <p>ID + 1 = {{ idPlusOne }}</p>
</template>
```

```vue
<script setup>
import { reactive } from 'vue'

// 解决方案 3：使用响应式对象代替（reactive 内部的 refs 自动解包）
const object = reactive({ id: 1 })
</script>

<template>
  <!-- 正确：普通响应式属性在表达式中有效 -->
  <p>ID + 1 = {{ object.id + 1 }}</p>
</template>
```

```javascript
// 为什么会这样：
// - 模板编译只向顶层标识符添加 .value
// - {{ count + 1 }} 编译为：count.value + 1
// - {{ object.id + 1 }} 编译为：object.id + 1（没有添加 .value！）
// - 纯 {{ object.id }} 有用于显示目的的特殊处理
```

## 参考
- [Vue.js 响应式基础 - 模板中解包的注意事项](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#caveat-when-unwrapping-in-templates)
