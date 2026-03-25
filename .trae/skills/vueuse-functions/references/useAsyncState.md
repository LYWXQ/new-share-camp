---
category: 状态
---

# useAsyncState

响应式异步状态。不会阻塞您的 setup 函数，并会在 promise 准备好后触发更改。状态默认是 `shallowRef`。

## 用法

```ts
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

const { state, isReady, isLoading } = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)
```

### 手动触发异步函数

您也可以手动触发它。这在您想要控制异步函数何时执行时很有用。

```vue
<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

const { state, execute, executeImmediate } = useAsyncState(action, '', { immediate: false })

async function action(event) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return `${event.target.textContent} 已点击！`
}
</script>

<template>
  <p>状态: {{ state }}</p>

  <button class="button" @click="executeImmediate">
    立即执行
  </button>

  <button class="ml-2 button" @click="event => execute(500, event)">
    延迟执行
  </button>
</template>
```

## 类型声明

```ts
export interface UseAsyncStateReturnBase<
  Data,
  Params extends any[],
  Shallow extends boolean,
> {
  state: Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>
  isReady: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<unknown>
  execute: (delay?: number, ...args: Params) => Promise<Data>
  executeImmediate: (...args: Params) => Promise<Data>
}
export type UseAsyncStateReturn<
  Data,
  Params extends any[],
  Shallow extends boolean,
> = UseAsyncStateReturnBase<Data, Params, Shallow> &
  PromiseLike<UseAsyncStateReturnBase<Data, Params, Shallow>>
export interface UseAsyncStateOptions<Shallow extends boolean, D = any> {
  /**
   * 当 "immediate" 为 true 时，第一次执行 promise 的延迟时间（毫秒）。
   *
   * @default 0
   */
  delay?: number
  /**
   * 在函数被调用后立即执行 promise。
   * 如果有的话将应用延迟。
   *
   * 设置为 false 时，您需要手动执行它。
   *
   * @default true
   */
  immediate?: boolean
  /**
   * 捕获错误时的回调。
   */
  onError?: (e: unknown) => void
  /**
   * 捕获成功时的回调。
   * @param {D} data
   */
  onSuccess?: (data: D) => void
  /**
   * 在执行 promise 前将状态设置为 initialState。
   *
   * 这在多次调用 execute 函数时很有用（例如，
   * 刷新数据）。设置为 false 时，当前状态保持不变，
   * 直到 promise 解决。
   *
   * @default true
   */
  resetOnExecute?: boolean
  /**
   * 使用 shallowRef。
   *
   * @default true
   */
  shallow?: Shallow
  /**
   *
   * 执行 execute 函数时抛出错误
   *
   * @default false
   */
  throwError?: boolean
}
/**
 * 响应式异步状态。不会阻塞您的 setup 函数，并会在 promise 准备好后触发更改。
 *
 * @see https://vueuse.org/useAsyncState
 * @param promise         要解决的 promise / 异步函数
 * @param initialState    初始状态，用于第一次评估完成前
 * @param options
 */
export declare function useAsyncState<
  Data,
  Params extends any[] = any[],
  Shallow extends boolean = true,
>(
  promise: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: MaybeRef<Data>,
  options?: UseAsyncStateOptions<Shallow, Data>,
): UseAsyncStateReturn<Data, Params, Shallow>
```
