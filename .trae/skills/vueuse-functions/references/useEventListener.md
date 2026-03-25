---
category: 浏览器
---

# useEventListener

轻松使用 EventListener。在挂载时使用 [addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 注册，在卸载时自动使用 [removeEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener) 注销。

## 用法

```ts
import { useEventListener } from '@vueuse/core'

useEventListener(document, 'visibilitychange', (evt) => {
  console.log(evt)
})
```

您还可以将 ref 作为事件目标传递，当您更改目标时，`useEventListener` 将注销先前的事件并注册新的事件。

```vue
<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const element = useTemplateRef('element')
useEventListener(element, 'keydown', (e) => {
  console.log(e.key)
})
</script>

<template>
  <div v-if="cond" ref="element">
    Div1
  </div>
  <div v-else ref="element">
    Div2
  </div>
</template>
```

您还可以调用返回的函数来注销监听器。

```ts
import { useEventListener } from '@vueuse/core'

const cleanup = useEventListener(document, 'keydown', (e) => {
  console.log(e.key)
})

cleanup() // 这将注销监听器。
```

注意，如果您的组件也在 SSR（服务器端渲染）中运行，您可能会收到错误（如 `document is not defined`），因为 DOM API 如 `document` 和 `window` 在 Node.js 中不可用。为避免这种情况，您可以将逻辑放在 `onMounted` 钩子中。

```ts
import { useEventListener } from '@vueuse/core'
// ---cut---
// onMounted 只会在客户端调用
// 因此它保证 DOM API 可用。
onMounted(() => {
  useEventListener(document, 'keydown', (e) => {
    console.log(e.key)
  })
})
```

## 类型声明

```ts
interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any
  removeEventListener: (event: Events, fn?: any, options?: any) => any
}
export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap
export type ShadowRootEventName = keyof ShadowRootEventMap
export interface GeneralEventListener<E = Event> {
  (evt: E): void
}
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 1：省略 Window 目标
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<E extends keyof WindowEventMap>(
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 2：显式 Window 目标
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 3：显式 Document 目标
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<
    Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>
  >,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 4：显式 ShadowRoot 目标
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<E extends keyof ShadowRootEventMap>(
  target: MaybeRefOrGetter<Arrayable<ShadowRoot> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<
    Arrayable<(this: ShadowRoot, ev: ShadowRootEventMap[E]) => any>
  >,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 5：显式 HTMLElement 目标
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeRefOrGetter<Arrayable<HTMLElement> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<(this: HTMLElement, ev: HTMLElementEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 6：带有事件类型推断的自定义事件目标
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<
  Names extends string,
  EventType = Event,
>(
  target: MaybeRefOrGetter<
    Arrayable<InferEventTarget<Names>> | null | undefined
  >,
  event: MaybeRefOrGetter<Arrayable<Names>>,
  listener: MaybeRef<Arrayable<GeneralEventListener<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
/**
 * 在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 注销。
 *
 * 重载 7：自定义事件目标回退
 *
 * @see https://vueuse.org/useEventListener
 */
export declare function useEventListener<EventType = Event>(
  target: MaybeRefOrGetter<Arrayable<EventTarget> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<string>>,
  listener: MaybeRef<Arrayable<GeneralEventListener<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn
```
