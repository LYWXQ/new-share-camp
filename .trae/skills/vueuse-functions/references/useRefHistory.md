---
category: 状态
related: useManualRefHistory
---

# useRefHistory

跟踪 ref 的更改历史，还提供撤销和重做功能

<CourseLink href="https://vueschool.io/lessons/ref-history-with-vueuse?friend=vueuse">通过 Vue School 的免费视频课程学习 useRefHistory！</CourseLink>

## 用法

```ts {5} twoslash include usage
import { useRefHistory } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef(0)
const { history, undo, redo } = useRefHistory(counter)
```

在内部，`watch` 用于在 ref 值修改时触发历史点。这意味着历史点是异步触发的，将同一 "tick" 中的修改批量处理。

```ts
// @include: usage
// ---cut---
counter.value += 1

await nextTick()
console.log(history.value)
/* [
  { snapshot: 1, timestamp: 1601912898062 },
  { snapshot: 0, timestamp: 1601912898061 }
] */
```

您可以使用 `undo` 将 ref 值重置到最后一个历史点。

```ts
// @include: usage
// ---cut---
console.log(counter.value) // 1
undo()
console.log(counter.value) // 0
```

### 对象 / 数组

当使用对象或数组时，由于更改其属性不会更改引用，因此不会触发提交。要跟踪属性更改，您需要传递 `deep: true`。它将为每个历史记录创建克隆。

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const state = ref({
  foo: 1,
  bar: 'bar',
})

const { history, undo, redo } = useRefHistory(state, {
  deep: true,
})

state.value.foo = 2

await nextTick()
console.log(history.value)
/* [
  { snapshot: { foo: 2, bar: 'bar' } },
  { snapshot: { foo: 1, bar: 'bar' } }
] */
```

#### 自定义克隆函数

`useRefHistory` 仅嵌入最小的克隆函数 `x => JSON.parse(JSON.stringify(x))`。要使用完整功能或自定义克隆函数，您可以通过 `clone` 选项进行设置。

例如，使用 [structuredClone](https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone)：

```ts
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, { clone: structuredClone })
```

或使用 [lodash 的 `cloneDeep`](https://lodash.com/docs/4.17.15#cloneDeep)：

```ts
import { useRefHistory } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'

const refHistory = useRefHistory(target, { clone: cloneDeep })
```

或更轻量级的 [`klona`](https://github.com/lukeed/klona)：

```ts
import { useRefHistory } from '@vueuse/core'
import { klona } from 'klona'

const refHistory = useRefHistory(target, { clone: klona })
```

#### 自定义 Dump 和 Parse 函数

除了使用 `clone` 选项外，您还可以传递自定义函数来控制序列化和解析。如果您不需要历史值是对象，这可以在撤销时节省额外的克隆。如果您希望快照已经字符串化以便保存到本地存储，这也很有用。

```ts
import { useRefHistory } from '@vueuse/core'

const refHistory = useRefHistory(target, {
  dump: JSON.stringify,
  parse: JSON.parse,
})
```

### 历史容量

默认情况下，我们将保留所有历史（无限制），直到您明确清除它们，您可以通过 `capacity` 选项设置要保留的最大历史数量。

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const refHistory = useRefHistory(target, {
  capacity: 15, // 限制为 15 条历史记录
})

refHistory.clear() // 明确清除所有历史
```

### 历史 WatchOptionFlush 时机

根据 [Vue 文档](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing)：Vue 的响应式系统会缓冲无效的效果并异步刷新它们，以避免在同一 "tick" 中发生许多状态突变时不必要的重复调用。

与 `watch` 相同，您可以使用 `flush` 选项修改刷新时机。

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const refHistory = useRefHistory(target, {
  flush: 'sync', // 选项 'pre'（默认）、'post' 和 'sync'
})
```

默认是 `'pre'`，以使此组合式函数与 Vue 监听器的默认值保持一致。这也有助于避免常见问题，例如作为 ref 值多步更新的一部分生成的几个历史点可能会破坏应用状态的不变性。如果您需要在同一 "tick" 中创建多个历史点，可以使用 `commit()`

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const r = shallowRef(0)
const { history, commit } = useRefHistory(r)

r.value = 1
commit()

r.value = 2
commit()

console.log(history.value)
/* [
  { snapshot: 2 },
  { snapshot: 1 },
  { snapshot: 0 },
] */
```

另一方面，当使用 flush `'sync'` 时，您可以使用 `batch(fn)` 为多个同步操作生成单个历史点

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const r = ref({ names: [], version: 1 })
const { history, batch } = useRefHistory(r, { flush: 'sync' })

batch(() => {
  r.value.names.push('Lena')
  r.value.version++
})

console.log(history.value)
/* [
  { snapshot: { names: [ 'Lena' ], version: 2 },
  { snapshot: { names: [], version: 1 },
] */
```

如果使用 `{ flush: 'sync', deep: true }`，在对数组进行可变 `splice` 时 `batch` 也很有用。`splice` 可以生成最多三个原子操作，这些操作将被推送到 ref 历史。

```ts
import { useRefHistory } from '@vueuse/core'
// ---cut---
const arr = ref([1, 2, 3])
const { history, batch } = useRefHistory(arr, { deep: true, flush: 'sync' })

batch(() => {
  arr.value.splice(1, 1) // batch 确保只生成一个历史点
})
```

另一个选项是避免使用 `arr.value = [...arr.value].splice(1,1)` 来突变原始 ref 值。

## 推荐阅读

- [History and Persistence](https://patak.dev/vue/history-and-persistence.html) - 作者 [@patak-dev](https://github.com/patak-dev)

## 类型声明

```ts
export interface UseRefHistoryOptions<Raw, Serialized = Raw>
  extends ConfigurableEventFilter {
  /**
   * 监视深层更改，默认为 false
   *
   * 设置为 true 时，它还将为存储在历史中的值创建克隆
   *
   * @default false
   */
  deep?: boolean
  /**
   * flush 选项允许更好地控制历史点的时机，默认为 'pre'
   *
   * 可能的值：'pre'、'post'、'sync'
   * 它的工作方式与 vue 响应式中 watch 和 watch effect 的 flush 选项相同
   *
   * @default 'pre'
   */
  flush?: WatchOptionFlush
  /**
   * 要保留的最大历史数量。默认为无限制。
   */
  capacity?: number
  /**
   * 拍摄快照时克隆，dump 的快捷方式：JSON.parse(JSON.stringify(value))。
   * 默认为 false
   *
   * @default false
   */
  clone?: boolean | CloneFn<Raw>
  /**
   * 将数据序列化到历史中
   */
  dump?: (v: Raw) => Serialized
  /**
   * 从历史中反序列化数据
   */
  parse?: (v: Serialized) => Raw
  /**
   * 确定提交是否应该继续的函数
   * @param oldValue 先前的值
   * @param newValue 新值
   * @returns 指示提交是否应该继续的布尔值
   */
  shouldCommit?: (oldValue: Raw | undefined, newValue: Raw) => boolean
}
export interface UseRefHistoryReturn<Raw, Serialized>
  extends UseManualRefHistoryReturn<Raw, Serialized> {
  /**
   * 表示跟踪是否启用的 ref
   */
  isTracking: Ref<boolean>
  /**
   * 暂停更改跟踪
   */
  pause: () => void
  /**
   * 恢复更改跟踪
   *
   * @param [commit] 如果为 true，恢复后将创建历史记录
   */
  resume: (commit?: boolean) => void
  /**
   * 在函数范围内自动暂停和自动恢复的糖语法
   *
   * @param fn
   */
  batch: (fn: (cancel: Fn) => void) => void
  /**
   * 清除数据并停止监视
   */
  dispose: () => void
}
/**
 * 跟踪 ref 的更改历史，还提供撤销和重做功能。
 *
 * @see https://vueuse.org/useRefHistory
 * @param source
 * @param options
 */
export declare function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options?: UseRefHistoryOptions<Raw, Serialized>,
): UseRefHistoryReturn<Raw, Serialized>
```
