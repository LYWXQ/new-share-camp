---
name: component-v-model
description: 在自定义组件上实现双向数据绑定
---

# 组件 v-model

在父组件和子组件之间创建双向绑定。

## defineModel()（3.4+，推荐）

实现 v-model 的最简单方式：

```vue
<!-- Child.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

```vue-html
<!-- Parent.vue -->
<Child v-model="searchText" />
```

`defineModel()` 返回一个 ref，它：
- 与父组件绑定的值同步
- 变更时触发 `update:modelValue`

### 带选项

```ts
// 必需的 model
const model = defineModel<string>({ required: true })

// 带默认值
const model = defineModel<number>({ default: 0 })
```

## 具名 v-model

使用参数实现多个 v-model：

```vue
<!-- UserName.vue -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>

<template>
  <input v-model="firstName" />
  <input v-model="lastName" />
</template>
```

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

## v-model 修饰符

访问和处理修饰符：

```vue-html
<MyComponent v-model.capitalize="text" />
```

```vue
<script setup lang="ts">
const [model, modifiers] = defineModel<string>()

console.log(modifiers) // { capitalize: true }
</script>
```

### 使用修饰符进行转换

使用 `get` 和 `set` 选项：

```vue
<script setup lang="ts">
const [model, modifiers] = defineModel<string>({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input v-model="model" />
</template>
```

### 具名 v-model 的修饰符

```vue-html
<MyComponent v-model:title.capitalize="title" />
```

```ts
const [title, titleModifiers] = defineModel<string>('title')
console.log(titleModifiers) // { capitalize: true }
```

## 手动实现（3.4 之前）

了解 `defineModel` 的底层实现：

```vue
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

对于具名 v-model `v-model:title`：

```ts
defineProps<{ title: string }>()
defineEmits<{ 'update:title': [value: string] }>()
```

## 为 defineModel 添加类型

```ts
// 基本
const model = defineModel<string>()
//    ^? Ref<string | undefined>

// 必需（移除 undefined）
const model = defineModel<string>({ required: true })
//    ^? Ref<string>

// 带修饰符
const [model, modifiers] = defineModel<string, 'trim' | 'capitalize'>()
//            ^? Record<'trim' | 'capitalize', true | undefined>
```

## 警告：默认值

在 `defineModel` 中设置默认值而不从父组件提供值会导致不同步：

```vue
<!-- 子组件：model 是 1 -->
<script setup>
const model = defineModel({ default: 1 })
</script>

<!-- 父组件：myRef 是 undefined -->
<script setup>
const myRef = ref()
</script>
<Child v-model="myRef" />
```

<!-- 
Source references:
- https://vuejs.org/guide/components/v-model.html
- https://vuejs.org/api/sfc-script-setup.html#definemodel
-->
