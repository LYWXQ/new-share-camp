---
name: composing-stores
description: Store 之间的通信和避免循环依赖
---

# Store 组合

Store 可以相互使用以共享状态和逻辑。

## 规则：避免循环依赖

两个 store 不能在设置期间直接读取彼此的 state：

```ts
// ❌ 无限循环
const useX = defineStore('x', () => {
  const y = useY()
  y.name // 不要在这里读取！
  return { name: ref('X') }
})

const useY = defineStore('y', () => {
  const x = useX()
  x.name // 不要在这里读取！
  return { name: ref('Y') }
})
```

**解决方案：** 在 getters、computed 或 actions 中读取：

```ts
const useX = defineStore('x', () => {
  const y = useY()

  // ✅ 在 computed/actions 中读取
  function doSomething() {
    const yName = y.name
  }

  return { name: ref('X'), doSomething }
})
```

## Setup Stores：在顶部使用 Store

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `你好 ${user.name}，你有 ${list.value.length} 件商品`
  })

  function purchase() {
    return apiPurchase(user.id, list.value)
  }

  return { list, summary, purchase }
})
```

## 共享 Getters

在 getter 内部调用 `useStore()`：

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()
      return `你好 ${user.name}，你有 ${state.list.length} 件商品`
    },
  },
})
```

## 共享 Actions

在 action 内部调用 `useStore()`：

```ts
import { useUserStore } from './user'
import { apiOrderCart } from './api'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

## SSR：在 await 之前调用 Store

在异步 actions 中，在任何 `await` 之前调用所有 store：

```ts
actions: {
  async orderCart() {
    // ✅ 所有 useStore() 调用在 await 之前
    const user = useUserStore()
    const analytics = useAnalyticsStore()

    try {
      await apiOrderCart(user.token, this.items)
      // ❌ 不要在 await 之后调用 useStore()（SSR 问题）
      // const otherStore = useOtherStore()
    } catch (err) {
      displayError(err)
    }
  },
}
```

这确保在 SSR 期间使用正确的 Pinia 实例。

<!--
Source references:
- https://pinia.vuejs.org/cookbook/composing-stores.html
-->
