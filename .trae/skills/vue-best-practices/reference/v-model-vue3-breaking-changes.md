---
title: Vue 2 到 Vue 3 的 v-model 破坏性变更
impact: HIGH
impactDescription: Vue 3 更改了 v-model 的 prop/event 名称并移除了 .sync 修饰符 - 需要迁移
type: migration
tags: [vue3, vue2, v-model, migration, breaking-changes, sync]
---

# Vue 2 到 Vue 3 的 v-model 破坏性变更

**影响：高** - Vue 3 从根本上改变了 v-model 在自定义组件上的工作方式。使用 Vue 2 模式的代码将静默失败 - 组件不会接收 prop 值，更改也不会传播到父级。

## 任务清单

- [ ] 将 prop 名称从 `value` 改为 `modelValue`
- [ ] 将事件名称从 `input` 改为 `update:modelValue`
- [ ] 用 `v-model:propName` 替换 `.sync` 修饰符
- [ ] 移除 `model` 组件选项（使用 defineModel 或命名 v-model）
- [ ] 将任何 v-bind.sync 更新为带命名参数的 v-model

## 关键破坏性变更

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 默认 prop | `value` | `modelValue` |
| 默认事件 | `input` | `update:modelValue` |
| 自定义名称 | `model: { prop, event }` | `v-model:customName` |
| Sync 修饰符 | `v-bind:prop.sync` | `v-model:prop` |
| 多个模型 | 不支持 | 完全支持 |

**Vue 2 模式（在 Vue 3 中不再有效）：**
```vue
<!-- Vue 2 子组件 -->
<script>
export default {
  props: ['value'],  // 在 Vue 3 中错误
  methods: {
    update(val) {
      this.$emit('input', val)  // 在 Vue 3 中错误
    }
  }
}
</script>

<template>
  <input :value="value" @input="update($event.target.value)">
</template>
```

**Vue 3 模式（Options API）：**
```vue
<!-- Vue 3 子组件 -->
<script>
export default {
  props: ['modelValue'],  // 从 'value' 更改
  emits: ['update:modelValue'],  // 声明 emits
  methods: {
    update(val) {
      this.$emit('update:modelValue', val)  // 从 'input' 更改
    }
  }
}
</script>

<template>
  <input :value="modelValue" @input="update($event.target.value)">
</template>
```

**Vue 3 模式（Composition API with defineModel）：**
```vue
<!-- Vue 3 子组件 - 推荐 -->
<script setup>
const model = defineModel()  // 自动处理 prop 和 emit
</script>

<template>
  <input v-model="model">
</template>
```

## 迁移 .sync 修饰符

Vue 2 的 `.sync` 修饰符已被移除。改用命名 v-model。

**Vue 2：**
```vue
<!-- 父组件 -->
<MyComponent :title.sync="pageTitle" />

<!-- 子组件 -->
<script>
export default {
  props: ['title'],
  methods: {
    updateTitle(val) {
      this.$emit('update:title', val)  // .sync 模式
    }
  }
}
</script>
```

**Vue 3：**
```vue
<!-- 父组件 -->
<MyComponent v-model:title="pageTitle" />

<!-- 子组件 with defineModel -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input v-model="title">
</template>

<!-- 子组件 with 手动 props/emits -->
<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['update:title'])
</script>

<template>
  <input
    :value="props.title"
    @input="emit('update:title', $event.target.value)"
  >
</template>
```

## 迁移自定义 model 选项

Vue 2 的 `model` 组件选项已被移除。

**Vue 2：**
```vue
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: ['checked']
}
</script>
```

**Vue 3：**
```vue
<!-- 改用命名 v-model 参数 -->
<!-- 父组件 -->
<MyCheckbox v-model:checked="isChecked" />

<!-- 子组件 -->
<script setup>
const checked = defineModel('checked')
</script>
```

## 多个 v-model 绑定（Vue 3 新增）

Vue 3 允许在单个组件上使用多个 v-model 指令：

```vue
<!-- 父组件 -->
<UserForm
  v-model:firstName="first"
  v-model:lastName="last"
  v-model:email="email"
/>

<!-- 子组件 -->
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
const email = defineModel('email')
</script>

<template>
  <input v-model="firstName" placeholder="名字">
  <input v-model="lastName" placeholder="姓氏">
  <input v-model="email" type="email" placeholder="邮箱">
</template>
```

## 参考
- [Vue 3 迁移指南 - v-model](https://v3-migration.vuejs.org/breaking-changes/v-model)
- [Vue.js 组件 v-model](https://vuejs.org/guide/components/v-model.html)
