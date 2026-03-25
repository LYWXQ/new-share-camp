---
name: provide-inject
description: 在组件树中传递数据，避免 prop 逐级传递
---

# Provide / Inject

从祖先组件向任意后代组件提供数据，避免 prop 逐级传递。

## 基本用法

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const message = ref('hello')
provide('message', message)
</script>
```

```vue
<!-- DeepChild.vue（任意层级深度） -->
<script setup lang="ts">
import { inject } from 'vue'

const message = inject('message')
</script>
```

## 使用 InjectionKey 进行类型定义

使用 `InjectionKey` 在提供者和注入者之间实现类型安全：

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export const messageKey = Symbol() as InjectionKey<Ref<string>>
export const countKey = Symbol() as InjectionKey<number>
```

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { messageKey } from './keys'

const message = ref('hello')
provide(messageKey, message)
</script>
```

```vue
<!-- Injector.vue -->
<script setup lang="ts">
import { inject } from 'vue'
import { messageKey } from './keys'

const message = inject(messageKey) // Ref<string> | undefined
</script>
```

## 默认值

```ts
// 简单默认值
const value = inject('message', 'default value')

// 工厂函数（用于昂贵的默认值）
const value = inject('key', () => new ExpensiveClass(), true)
//                                                       ^ 视为工厂函数
```

## 应用级 Provide

对所有组件可用：

```ts
// main.ts
import { createApp } from 'vue'

const app = createApp(App)
app.provide('globalConfig', { theme: 'dark' })
```

## 响应式 Provide/Inject

提供响应式值以实现自动更新：

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)
</script>
```

注入的值保持响应式连接。

## 变更的最佳实践

将变更保留在提供者中，暴露更新函数：

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

const location = ref('North Pole')

function updateLocation(newLocation: string) {
  location.value = newLocation
}

provide('location', {
  location: readonly(location), // 防止直接变更
  updateLocation
})
</script>
```

```vue
<!-- Injector.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const { location, updateLocation } = inject('location')!
</script>

<template>
  <button @click="updateLocation('South Pole')">
    {{ location }}
  </button>
</template>
```

## 使用 Symbol 键

推荐用于库和大型应用以避免冲突：

```ts
// keys.ts
export const myKey = Symbol('myKey')

// 提供者
provide(myKey, value)

// 注入者
inject(myKey)
```

## 类型辅助

```ts
// 带显式类型的字符串键
const foo = inject<string>('foo')
//    ^? string | undefined

// 带默认值（移除 undefined）
const foo = inject<string>('foo', 'default')
//    ^? string

// 强制非 undefined（确定已提供时使用）
const foo = inject('foo') as string
```

<!-- 
Source references:
- https://vuejs.org/guide/components/provide-inject.html
- https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject
-->
