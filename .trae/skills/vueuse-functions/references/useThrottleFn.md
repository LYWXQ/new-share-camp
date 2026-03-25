---
category: 工具
related: refThrottled, refDebounced, useDebounceFn
---

# useThrottleFn

节流执行函数。特别适用于对调整大小和滚动等事件的处理程序进行速率限制执行。

> 节流是一个弹簧，它抛出球：球飞出后，它需要一些时间收缩回来，所以它不能抛出更多的球，除非它准备好了。

## 用法

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // 做一些事情，它每秒最多被调用 1 次
}, 1000)

useEventListener(window, 'resize', throttledFn)
```

## 推荐阅读

- [**Debounce vs Throttle**: 权威视觉指南](https://kettanaito.com/blog/debounce-vs-throttle)

## 类型声明

```ts
/**
 * 节流执行函数。特别适用于对调整大小和滚动等事件的处理程序进行速率限制执行。
 *
 * @param   fn             延迟毫秒后要执行的函数。`this` 上下文和所有参数都按原样传递，
 *                                    当节流函数被执行时传递给 `callback`。
 * @param   ms             零或更大的延迟（毫秒）。对于事件回调，大约 100 或 250（甚至更高）的值最有用。
 *                                    （默认值：200）
 *
 * @param [trailing] 如果为 true，在时间结束后再次调用 fn（默认值：false）
 *
 * @param [leading] 如果为 true，在 ms 超时的前沿调用 fn（默认值：true）
 *
 * @param [rejectOnCancel] 如果为 true，如果最后一次调用被取消则拒绝（默认值：false）
 *
 * @return 一个新的节流函数。
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useThrottleFn<T extends FunctionArgs>(
  fn: T,
  ms?: MaybeRefOrGetter<number>,
  trailing?: boolean,
  leading?: boolean,
  rejectOnCancel?: boolean,
): PromisifyFn<T>
```
