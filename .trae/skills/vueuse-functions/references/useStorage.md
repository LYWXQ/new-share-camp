---
category: 状态
related: useLocalStorage, useSessionStorage, useStorageAsync
---

# useStorage

创建可用于访问和修改 [LocalStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 或 [SessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) 的响应式 ref。

默认使用 localStorage，其他存储源可通过第三个参数指定。

## 用法

::: tip
与 Nuxt 3 一起使用时，此函数**不会**自动导入，以支持 Nitro 内置的 [`useStorage()`](https://nitro.unjs.io/guide/storage)。如果要使用 VueUse 中的函数，请使用显式导入。
:::

```ts
import { useStorage } from '@vueuse/core'

// 绑定对象
const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' })

// 绑定布尔值
const flag = useStorage('my-flag', true) // 返回 Ref<boolean>

// 绑定数字
const count = useStorage('my-count', 0) // 返回 Ref<number>

// 使用 SessionStorage 绑定字符串
const id = useStorage('my-id', 'some-string-id', sessionStorage) // 返回 Ref<string>

// 从存储中删除数据
state.value = null
```

## 合并默认值

默认情况下，`useStorage` 将使用存储中的值（如果存在）并忽略默认值。请注意，当您向默认值添加更多属性时，如果客户端的存储没有该键，该键可能是 `undefined`。

```ts
import { useStorage } from '@vueuse/core'
// ---cut---
localStorage.setItem('my-store', '{"hello": "hello"}')

const state = useStorage('my-store', { hello: 'hi', greeting: 'hello' }, localStorage)

console.log(state.value.greeting) // undefined，因为该值不在存储中
```

要解决此问题，您可以启用 `mergeDefaults` 选项。

```ts
import { useStorage } from '@vueuse/core'
// ---cut---
localStorage.setItem('my-store', '{"hello": "nihao"}')

const state = useStorage(
  'my-store',
  { hello: 'hi', greeting: 'hello' },
  localStorage,
  { mergeDefaults: true } // <--
)

console.log(state.value.hello) // 'nihao'，来自存储
console.log(state.value.greeting) // 'hello'，来自合并的默认值
```

当设置为 true 时，它将对对象执行**浅合并**。您可以传递一个函数来执行自定义合并（例如深合并），例如：

```ts
import { useStorage } from '@vueuse/core'
// ---cut---
const state = useStorage(
  'my-store',
  { hello: 'hi', greeting: 'hello' },
  localStorage,
  { mergeDefaults: (storageValue, defaults) => deepMerge(defaults, storageValue) } // <--
)
```

## 自定义序列化

默认情况下，`useStorage` 将根据提供的默认值的数据类型智能地使用相应的序列化器。例如，对于对象将使用 `JSON.stringify` / `JSON.parse`，对于数字将使用 `Number.toString` / `parseFloat` 等。

您还可以提供自己的序列化函数给 `useStorage`：

```ts
import { useStorage } from '@vueuse/core'

useStorage(
  'key',
  {},
  undefined,
  {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    },
  },
)
```

请注意，当您提供 `null` 作为默认值时，`useStorage` 无法从中推断数据类型。在这种情况下，您可以提供自定义序列化器或显式重用内置的序列化器。

```ts
import { StorageSerializers, useStorage } from '@vueuse/core'

const objectLike = useStorage('key', null, undefined, { serializer: StorageSerializers.object })
objectLike.value = { foo: 'bar' }
```

## 类型声明

```ts
export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}
export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>
  write: (value: T) => Awaitable<string>
}
export declare const StorageSerializers: Record<
  "boolean" | "object" | "number" | "any" | "string" | "map" | "set" | "date",
  Serializer<any>
>
export declare const customStorageEventName = "vueuse-storage"
export interface StorageEventLike {
  storageArea: StorageLike | null
  key: StorageEvent["key"]
  oldValue: StorageEvent["oldValue"]
  newValue: StorageEvent["newValue"]
}
export interface UseStorageOptions<T>
  extends ConfigurableEventFilter,
    ConfigurableWindow,
    ConfigurableFlush {
  /**
   * 监视深层更改
   *
   * @default true
   */
  deep?: boolean
  /**
   * 监听存储更改，对多标签页应用有用
   *
   * @default true
   */
  listenToStorageChanges?: boolean
  /**
   * 当存储不存在时将默认值写入存储
   *
   * @default true
   */
  writeDefaults?: boolean
  /**
   * 将默认值与从存储读取的值合并。
   *
   * 当设置为 true 时，它将对对象执行**浅合并**。
   * 您可以传递一个函数来执行自定义合并（例如深合并），例如：
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
  /**
   * 自定义数据序列化
   */
  serializer?: Serializer<T>
  /**
   * 错误回调
   *
   * 默认将错误记录到 `console.error`
   */
  onError?: (error: unknown) => void
  /**
   * 使用 shallow ref 作为引用
   *
   * @default false
   */
  shallow?: boolean
  /**
   * 等待组件挂载后再读取存储。
   *
   * @default false
   */
  initOnMounted?: boolean
}
export declare function useStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<string>,
  storage?: StorageLike,
  options?: UseStorageOptions<string>,
): RemovableRef<string>
export declare function useStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: StorageLike,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>
export declare function useStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<number>,
  storage?: StorageLike,
  options?: UseStorageOptions<number>,
): RemovableRef<number>
export declare function useStorage<T>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
export declare function useStorage<T = unknown>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<null>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
```
