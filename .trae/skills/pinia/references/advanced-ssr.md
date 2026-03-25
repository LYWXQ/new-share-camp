---
name: server-side-rendering
description: SSR 设置、状态注水和避免跨请求状态污染
---

# 服务端渲染 (SSR)

当在 `setup` 顶部、getters 或 actions 中调用 store 时，Pinia 可与 SSR 一起工作。

> **使用 Nuxt？** 请查看 [Nuxt 集成](advanced-nuxt.md)。

## 基本用法

```vue
<script setup>
// ✅ 有效 - pinia 在 setup 中知道应用上下文
const main = useMainStore()
</script>
```

## 在 setup() 外部使用 Store

显式传递 `pinia` 实例：

```ts
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ 为正确的 SSR 上下文传递 pinia
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) {
    return '/login'
  }
})
```

## serverPrefetch()

通过 `this.$pinia` 访问 pinia：

```ts
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
    return store.fetchData()
  },
}
```

## onServerPrefetch()

正常工作：

```vue
<script setup>
const store = useStore()

onServerPrefetch(async () => {
  await store.fetchData()
})
</script>
```

## 状态注水

在服务端序列化状态，在客户端注水。

### 服务端

使用 [devalue](https://github.com/Rich-Harris/devalue) 进行 XSS 安全序列化：

```ts
import devalue from 'devalue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// 渲染后，状态可用
const serializedState = devalue(pinia.state.value)
// 作为全局变量注入 HTML
```

### 客户端

在任何 `useStore()` 调用之前注水：

```ts
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 从序列化状态注水（例如从 window.__pinia）
if (typeof window !== 'undefined') {
  pinia.state.value = JSON.parse(window.__pinia)
}
```

## SSR 示例

- [Vitesse 模板](https://github.com/antfu/vitesse/blob/main/src/modules/pinia.ts)
- [vite-plugin-ssr](https://vite-plugin-ssr.com/pinia)

## 关键点

1. 在函数内部调用 store，而不是在模块作用域
2. 在 SSR 中于组件外部使用 store 时传递 `pinia` 实例
3. 在调用任何 `useStore()` 之前先注水状态
4. 使用 `devalue` 或类似工具进行安全序列化
5. 通过为每个请求创建新的 pinia 来避免跨请求状态污染

<!--
Source references:
- https://pinia.vuejs.org/ssr/
-->
