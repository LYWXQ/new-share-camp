---
name: component-events-emits
description: 从子组件向父组件触发自定义事件并处理
---

# 组件事件

组件触发自定义事件与父组件通信。

## 触发事件

在模板中使用 `$emit` 或在 script 中使用 `defineEmits`：

```vue
<script setup lang="ts">
const emit = defineEmits(['inFocus', 'submit'])

function handleClick() {
  emit('submit')
}
</script>

<template>
  <button @click="$emit('inFocus')">聚焦</button>
  <button @click="handleClick">提交</button>
</template>
```

## 基于类型的声明（推荐）

```vue
<script setup lang="ts">
// 调用签名语法
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 命名元组语法（3.3+，更简洁）
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()

// 使用
emit('change', 123)
emit('update', 'hello')
</script>
```

## 事件参数

向事件传递额外参数：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  increaseBy: [amount: number]
}>()

function increase() {
  emit('increaseBy', 5)
}
</script>
```

父组件接收参数：

```vue-html
<!-- 内联处理器 -->
<MyButton @increase-by="(n) => count += n" />

<!-- 方法处理器 -->
<MyButton @increase-by="increaseCount" />
```

```ts
function increaseCount(n: number) {
  count.value += n
}
```

## 事件验证

使用对象语法验证事件载荷：

```vue
<script setup lang="ts">
const emit = defineEmits({
  // 无验证
  click: null,
  
  // 验证 submit 事件
  submit: ({ email, password }: { email: string; password: string }) => {
    if (email && password) {
      return true
    }
    console.warn('无效的 submit 载荷！')
    return false
  }
})
</script>
```

## 监听事件

使用 `v-on` 或 `@` 简写：

```vue-html
<MyComponent @some-event="handleEvent" />

<!-- 使用 .once 修饰符 -->
<MyComponent @some-event.once="handleOnce" />
```

## 事件命名规范

- 使用 camelCase 触发
- 使用 kebab-case 监听

```ts
emit('someEvent')
```

```vue-html
<MyComponent @some-event="handler" />
```

## 重要说明

- 组件事件**不会冒泡**（与 DOM 事件不同）
- 只能监听直接子组件的事件
- 对于兄弟/深层嵌套通信，使用 provide/inject 或状态管理

<!-- 
Source references:
- https://vuejs.org/guide/components/events.html
- https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
-->
