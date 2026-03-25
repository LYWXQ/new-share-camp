---
name: script-setup
description: 单文件组件中 Composition API 的编译时语法糖
---

# Script Setup

`<script setup>` 是单文件组件中 Composition API 的推荐语法。

## 基本语法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

## 优势

- 更少的样板代码（无需 `export default`，无需 `return`）
- TypeScript 类型推断
- 更好的运行时性能
- 更好的 IDE 支持

## 顶层绑定

所有顶层绑定自动在模板中可用：

```vue
<script setup lang="ts">
// 变量
const msg = 'Hello'

// 导入
import { capitalize } from './helpers'
import MyComponent from './MyComponent.vue'

// 函数
function greet() {
  console.log(msg)
}
</script>

<template>
  <MyComponent />
  <p>{{ capitalize(msg) }}</p>
  <button @click="greet">问候</button>
</template>
```

## 编译器宏

这些无需导入即可使用：

- `defineProps()` - 声明 props
- `defineEmits()` - 声明 emits
- `defineModel()` - 声明 v-model（3.4+）
- `defineExpose()` - 暴露公共实例属性
- `defineOptions()` - 声明组件选项（3.3+）
- `defineSlots()` - 类型化插槽 props（3.3+）
- `withDefaults()` - 提供 props 默认值

## 使用组件

直接导入使用，无需注册：

```vue
<script setup lang="ts">
import MyComponent from './MyComponent.vue'
import { MyButton } from './components'
</script>

<template>
  <MyComponent />
  <MyButton />
</template>
```

### 动态组件

```vue
<script setup lang="ts">
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="condition ? Foo : Bar" />
</template>
```

### 递归组件

单文件组件可以通过文件名引用自身：

```vue
<!-- FooBar.vue 可以在其模板中使用 <FooBar/> -->
```

## 自定义指令

以 `v` 开头的变量可作为指令使用：

```vue
<script setup lang="ts">
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

## defineExpose()

组件默认是封闭的。使用 `defineExpose` 暴露属性：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const publicMethod = () => console.log('called')

defineExpose({
  count,
  publicMethod
})
</script>
```

父组件可通过模板 ref 访问：

```ts
const childRef = ref()
childRef.value.count // 可访问
childRef.value.publicMethod() // 可访问
```

## defineOptions()（3.3+）

无需单独的 `<script>` 块即可声明组件选项：

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
  name: 'CustomName'
})
</script>
```

## defineSlots()（3.3+）

为 IDE 支持类型化插槽 props：

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
  header(props: { title: string }): any
}>()
</script>
```

## useSlots() & useAttrs()

在 script 中访问插槽和属性：

```vue
<script setup lang="ts">
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

## 顶层 await

使用 Suspense 的异步 setup：

```vue
<script setup lang="ts">
const data = await fetch('/api/data').then(r => r.json())
</script>
```

> 注意：需要在父组件中有 `<Suspense>` 边界。

## 泛型组件（TypeScript）

```vue
<script setup lang="ts" generic="T extends string | number">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

带约束的多个泛型：

```vue
<script setup lang="ts" generic="T extends Item, U extends string">
import type { Item } from './types'

defineProps<{
  item: T
  label: U
}>()
</script>
```

## 与普通 script 一起使用

用于高级场景，如具名导出或一次性副作用：

```vue
<script lang="ts">
// 模块导入时运行一次
runSideEffect()

export const exportedValue = 'hello'
</script>

<script setup lang="ts">
// 每个组件实例运行时执行
</script>
```

<!-- 
Source references:
- https://vuejs.org/api/sfc-script-setup.html
-->
