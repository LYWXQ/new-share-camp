---
name: vue-reactivity-system
description: 核心响应式原语 - ref、reactive、computed 和侦听器
---

# Vue 响应式系统

Vue 的响应式系统支持自动追踪状态变更和 DOM 更新。

## ref()

使用 `ref()` 创建响应式原始值。在 JavaScript 中通过 `.value` 访问/修改，在模板中自动解包。

```ts
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++
```

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

### 为 ref 添加类型

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

// 类型推断
const year = ref(2020) // Ref<number>

// 显式泛型
const name = ref<string | null>(null)

// Ref 类型注解
const id: Ref<string | number> = ref('abc')
```

## reactive()

创建响应式对象。不需要 `.value`，但不能重新赋值整个对象。

```ts
import { reactive } from 'vue'

interface State {
  count: number
  name: string
}

const state: State = reactive({
  count: 0,
  name: 'Vue'
})

state.count++ // 响应式
```

### reactive() 的局限性

1. **仅适用于对象** - 不适用于原始值
2. **不能替换整个对象** - 会失去响应式
3. **解构会失去响应式** - 使用 `toRefs()` 替代

```ts
const state = reactive({ count: 0 })

// ❌ 失去响应式
let { count } = state

// ✅ 使用 toRefs
import { toRefs } from 'vue'
const { count } = toRefs(state)
```

## 推荐做法

使用 `ref()` 作为声明响应式状态的主要 API - 它适用于任何值类型且行为一致。

## 深层响应式

`ref()` 和 `reactive()` 默认都是深层响应式的：

```ts
const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

// 这些会触发更新
obj.value.nested.count++
obj.value.arr.push('baz')
```

使用 `shallowRef()` 或 `shallowReactive()` 选择退出深层响应式以提升性能。

## DOM 更新时机

DOM 更新是批量和异步的。使用 `nextTick()` 等待更新完成：

```ts
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++
  await nextTick()
  // DOM 现在已更新
}
```

## Ref 解包规则

- **在模板中**：顶层 ref 自动解包
- **在响应式对象中**：作为属性访问时 ref 自动解包
- **在数组/集合中**：ref 不会自动解包

```ts
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0（已解包）

const books = reactive([ref('Vue Guide')])
console.log(books[0].value) // 需要 .value
```

## computed()

从响应式状态派生值并自动缓存。仅在依赖变更时重新计算。

```ts
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

### 计算属性最佳实践

- **getter 应该是纯函数** - 无副作用，不修改其他状态
- **不要修改计算属性值** - 修改源数据
- **对派生数据使用计算属性而非方法**（缓存优势）

```ts
// ✅ 缓存 - 仅在 items 变更时重新计算
const activeItems = computed(() => items.value.filter(x => x.active))

// ❌ 不缓存 - 每次渲染都运行
function getActiveItems() {
  return items.value.filter(x => x.active)
}
```

## watch()

显式侦听响应式源，在它们变更时运行副作用。默认惰性执行。

```ts
import { ref, watch } from 'vue'

const id = ref(1)

watch(id, async (newId, oldId) => {
  const data = await fetchData(newId)
  // 处理数据...
})
```

### 侦听源类型

```ts
const x = ref(0)
const obj = reactive({ count: 0 })

// 单个 ref
watch(x, (newX) => console.log(newX))

// getter 函数
watch(() => obj.count, (count) => console.log(count))

// 多个源
watch([x, () => obj.count], ([newX, newCount]) => {
  console.log(newX, newCount)
})
```

### 侦听选项

```ts
watch(source, callback, {
  immediate: true,  // 创建时立即运行
  deep: true,       // 侦听嵌套属性
  once: true,       // 仅触发一次（3.4+）
  flush: 'post'     // DOM 更新后运行
})
```

## watchEffect()

自动追踪依赖并立即运行。当任何追踪的依赖变更时重新运行。

```ts
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

watchEffect(async () => {
  const response = await fetch(`/api/todos/${todoId.value}`)
  data.value = await response.json()
})
```

### watch vs watchEffect

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 显式 | 自动 |
| 惰性 | 是 | 否（立即） |
| 访问旧值 | 是 | 否 |
| 最适合 | 特定源 | 多个依赖 |

## 侦听器清理（3.5+）

取消过期的异步操作：

```ts
import { watch, onWatcherCleanup } from 'vue'

watch(id, async (newId) => {
  const controller = new AbortController()
  
  fetch(`/api/${newId}`, { signal: controller.signal })
  
  onWatcherCleanup(() => controller.abort())
})
```

## 停止侦听器

```ts
const stop = watch(source, callback)
const stop2 = watchEffect(() => { /* ... */ })

// 手动停止
stop()
stop2()

// 暂停/恢复（3.5+）
const { stop, pause, resume } = watchEffect(() => { /* ... */ })
```

<!-- 
Source references:
- https://vuejs.org/guide/essentials/reactivity-fundamentals.html
- https://vuejs.org/guide/essentials/computed.html
- https://vuejs.org/guide/essentials/watchers.html
- https://vuejs.org/api/reactivity-core.html
-->
