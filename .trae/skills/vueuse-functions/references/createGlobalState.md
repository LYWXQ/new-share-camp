---
category: 状态
related: createSharedComposable
---

# createGlobalState

将状态保持在全局范围内，以便在多个 Vue 实例之间复用。

## 用法

### 无持久化（存储在内存中）

```ts
// store.ts
import { createGlobalState } from '@vueuse/core'
import { shallowRef } from 'vue'

export const useGlobalState = createGlobalState(
  () => {
    const count = shallowRef(0)
    return { count }
  }
)
```

更大的示例：

```ts
// store.ts
import { createGlobalState } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

export const useGlobalState = createGlobalState(
  () => {
    // 状态
    const count = shallowRef(0)

    // 获取器
    const doubleCount = computed(() => count.value * 2)

    // 动作
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment }
  }
)
```

### 带持久化

使用 `useStorage` 存储在 `localStorage` 中：

```ts twoslash include store
// store.ts
import { createGlobalState, useStorage } from '@vueuse/core'

export const useGlobalState = createGlobalState(
  () => useStorage('vueuse-local-storage', 'initialValue'),
)
```

```ts
// @filename: store.ts
// @include: store
// ---cut---
// component.ts
import { useGlobalState } from './store'

export default defineComponent({
  setup() {
    const state = useGlobalState()
    return { state }
  },
})
```

## 类型声明

```ts
export type CreateGlobalStateReturn<Fn extends AnyFn = AnyFn> = Fn
/**
 * 将状态保持在全局范围内，以便在多个 Vue 实例之间复用。
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory 创建状态的工厂函数
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function createGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
): CreateGlobalStateReturn<Fn>
```
