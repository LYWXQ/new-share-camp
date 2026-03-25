---
name: typescript-integration
description: 在 Composition API 中为 Vue 组件添加 TypeScript 类型
---

# TypeScript 与 Vue

Vue 在 Composition API 中提供出色的 TypeScript 支持。

## 为 Props 添加类型

### 基于类型的声明（推荐）

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: string[]
  user: { name: string; age: number }
}

const props = defineProps<Props>()
```

### 带默认值（3.5+）

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one'] } = defineProps<Props>()
```

### 使用 withDefaults（3.4 及以下）

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

### 复杂 prop 类型

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
  callback: (id: number) => void
}>()
```

## 为 Emits 添加类型

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
</script>
```

## 为 ref() 添加类型

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

// 推断
const count = ref(0) // Ref<number>

// 显式泛型
const name = ref<string>() // Ref<string | undefined>

// 类型注解
const id: Ref<string | number> = ref('abc')
```

## 为 reactive() 添加类型

```ts
import { reactive } from 'vue'

interface State {
  count: number
  name: string
}

// 在变量上使用接口
const state: State = reactive({
  count: 0,
  name: 'Vue'
})
```

## 为 computed() 添加类型

```ts
import { computed } from 'vue'

// 从 getter 推断
const double = computed(() => count.value * 2) // ComputedRef<number>

// 显式泛型
const result = computed<string>(() => {
  return String(value.value)
})
```

## 为事件处理器添加类型

```vue
<script setup lang="ts">
function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}
</script>

<template>
  <input @change="handleChange" />
</template>
```

## 为模板引用添加类型

### useTemplateRef（3.5+）

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

### 传统 ref 方式

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

## 为组件引用添加类型

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyComponent from './MyComponent.vue'

type MyComponentInstance = InstanceType<typeof MyComponent>
const compRef = useTemplateRef<MyComponentInstance>('comp')
</script>

<template>
  <MyComponent ref="comp" />
</template>
```

## 为 Provide/Inject 添加类型

```ts
import { provide, inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

// 定义类型化键
const countKey = Symbol() as InjectionKey<Ref<number>>

// 提供者
provide(countKey, ref(0))

// 注入者
const count = inject(countKey) // Ref<number> | undefined

// 带默认值
const count = inject(countKey, ref(0)) // Ref<number>

// 带显式类型的字符串键
const foo = inject<string>('foo')
```

## 为 defineModel 添加类型（3.4+）

```ts
// 基本
const model = defineModel<string>()
//    ^? Ref<string | undefined>

// 必需
const model = defineModel<string>({ required: true })
//    ^? Ref<string>

// 带修饰符
const [model, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                ^? Record<'trim' | 'uppercase', true | undefined>
```

## 全局自定义属性

为全局属性扩展 `ComponentCustomProperties`：

```ts
// types/vue.d.ts
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

## 泛型组件

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()

defineEmits<{
  select: [item: T]
}>()
</script>
```

<!-- 
Source references:
- https://vuejs.org/guide/typescript/composition-api.html
- https://vuejs.org/guide/typescript/overview.html
-->
