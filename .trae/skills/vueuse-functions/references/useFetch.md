---
category: 网络
---

# useFetch

响应式 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 提供中止请求的能力，在请求发送前拦截请求，当 URL 更改时自动重新获取请求，以及使用预定义选项创建自己的 `useFetch`。

<CourseLink href="https://vueschool.io/lessons/vueuse-utilities-usefetch-and-reactify?friend=vueuse">通过 Vue School 的免费视频课程学习 useFetch！</CourseLink>

::: tip
与 Nuxt 3 一起使用时，此函数**不会**自动导入，以支持 Nuxt 内置的 [`useFetch()`](https://v3.nuxtjs.org/api/composables/use-fetch)。如果要使用 VueUse 中的函数，请使用显式导入。
:::

## 用法

### 基本用法

`useFetch` 函数可以通过简单地提供 URL 来使用。URL 可以是字符串或 `ref`。`data` 对象将包含请求的结果，`error` 对象将包含任何错误，`isFetching` 对象将指示请求是否正在加载。

```ts
import { useFetch } from '@vueuse/core'

const { isFetching, error, data } = useFetch(url)
```

### 异步用法

`useFetch` 也可以像普通 fetch 一样等待。请注意，每当组件是异步的时，使用它的任何组件都必须将组件包装在 `<Suspense>` 标签中。您可以在 [官方 Vue 3 文档](https://vuejs.org/guide/built-ins/suspense.html) 中阅读更多关于 suspense API 的信息

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { isFetching, error, data } = await useFetch(url)
```

### URL 更改时重新获取

使用 `ref` 作为 URL 参数将允许 `useFetch` 函数在 URL 更改时自动触发另一个请求。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const url = ref('https://my-api.com/user/1')

const { data } = useFetch(url, { refetch: true })

url.value = 'https://my-api.com/user/2' // 将触发另一个请求
```

### 阻止请求立即触发

将 `immediate` 选项设置为 false 将阻止请求触发，直到调用 `execute` 函数。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { execute } = useFetch(url, { immediate: false })

execute()
```

### 中止请求

可以使用 `useFetch` 函数中的 `abort` 函数中止请求。`canAbort` 属性指示请求是否可以中止。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { abort, canAbort } = useFetch(url)

setTimeout(() => {
  if (canAbort.value)
    abort()
}, 100)
```

也可以使用 `timeout` 属性自动中止请求。当达到给定超时时，它将调用 `abort` 函数。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { data } = useFetch(url, { timeout: 100 })
```

### 拦截请求

`beforeFetch` 选项可以在请求发送前拦截请求并修改请求选项和 URL。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { data } = useFetch(url, {
  async beforeFetch({ url, options, cancel }) {
    const myToken = await getMyToken()

    if (!myToken)
      cancel()

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${myToken}`,
    }

    return {
      options,
    }
  },
})
```

`afterFetch` 选项可以在更新前拦截响应数据。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { data } = useFetch(url, {
  afterFetch(ctx) {
    if (ctx.data.title === 'HxH')
      ctx.data.title = 'Hunter x Hunter' // 修改响应数据

    return ctx
  },
})
```

当 `updateDataOnError` 设置为 `true` 时，`onFetchError` 选项可以在更新前拦截响应数据和错误。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { data } = useFetch(url, {
  updateDataOnError: true,
  onFetchError(ctx) {
    // 当 5xx 响应时 ctx.data 可能为 null
    if (ctx.data === null)
      ctx.data = { title: 'Hunter x Hunter' } // 修改响应数据

    ctx.error = new Error('自定义错误') // 修改错误
    return ctx
  },
})

console.log(data.value) // { title: 'Hunter x Hunter' }
```

### 设置请求方法和返回类型

可以通过在 `useFetch` 末尾添加适当的方法来设置请求方法和返回类型

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
// 请求将使用 GET 方法发送，数据将被解析为 JSON
const { data } = useFetch(url).get().json()

// 请求将使用 POST 方法发送，数据将被解析为文本
const { data } = useFetch(url).post().text()

// 或使用选项设置方法

// 请求将使用 GET 方法发送，数据将被解析为 blob
const { data } = useFetch(url, { method: 'GET' }, { refetch: true }).blob()
```

### 创建自定义实例

`createFetch` 函数将返回一个 useFetch 函数，其中包含提供给它的任何预配置选项。这对于在整个应用程序中与使用相同基本 URL 或需要授权标头的 API 进行交互非常有用。

```ts
import { createFetch } from '@vueuse/core'
// ---cut---
const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  options: {
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`

      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

const { isFetching, error, data } = useMyFetch('users')
```

如果您想控制预配置实例和新生成实例之间的 `beforeFetch`、`afterFetch`、`onFetchError` 行为。您可以提供 `combination` 选项来在 `overwrite` 或 `chaining` 之间切换。

```ts
import { createFetch } from '@vueuse/core'
// ---cut---
const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  combination: 'overwrite',
  options: {
    // 预配置实例中的 beforeFetch 仅当新生成的实例未传递 beforeFetch 时才会运行
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`

      return { options }
    },
  },
})

// 使用 useMyFetch 的 beforeFetch
const { isFetching, error, data } = useMyFetch('users')

// 使用自定义 beforeFetch
const { isFetching, error, data } = useMyFetch('users', {
  async beforeFetch({ url, options, cancel }) {
    const myToken = await getMyToken()

    if (!myToken)
      cancel()

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${myToken}`,
    }

    return {
      options,
    }
  },
})
```

您可以通过在 `afterFetch` 或 `onFetchError` 中调用 `execute` 方法来重新执行请求。以下是一个简单的刷新令牌示例：

```ts
import { createFetch } from '@vueuse/core'
// ---cut---
let isRefreshing = false
const refreshSubscribers: Array<() => void> = []

const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  options: {
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`

      return { options }
    },
    afterFetch({ data, response, context, execute }) {
      if (needRefreshToken) {
        if (!isRefreshing) {
          isRefreshing = true
          refreshToken().then((newToken) => {
            if (newToken.value) {
              isRefreshing = false
              setMyToken(newToken.value)
              onRefreshed()
            }
            else {
              refreshSubscribers.length = 0
              // 处理刷新令牌错误
            }
          })
        }

        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            execute().then((response) => {
              resolve({ data, response })
            })
          })
        })
      }

      return { data, response }
    },
    // 或在 updateDataOnError 时使用 onFetchError
    updateDataOnError: true,
    onFetchError({ error, data, response, context, execute }) {
      // 与 afterFetch 相同
      return { error, data }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

async function refreshToken() {
  const { data, execute } = useFetch<string>('refresh-token', {
    immediate: false,
  })

  await execute()
  return data
}

function onRefreshed() {
  refreshSubscribers.forEach(callback => callback())
  refreshSubscribers.length = 0
}

function addRefreshSubscriber(callback: () => void) {
  refreshSubscribers.push(callback)
}

const { isFetching, error, data } = useMyFetch('users')
```

### 事件

`onFetchResponse` 和 `onFetchError` 将分别在获取请求响应和错误时触发。

```ts
import { useFetch } from '@vueuse/core'
// ---cut---
const { onFetchResponse, onFetchError } = useFetch(url)

onFetchResponse((response) => {
  console.log(response.status)
})

onFetchError((error) => {
  console.error(error.message)
})
```

## 类型声明

```ts
export interface UseFetchReturn<T> {
  /**
   * 指示获取请求是否已完成
   */
  isFinished: Readonly<ShallowRef<boolean>>
  /**
   * HTTP 获取响应的状态码
   */
  statusCode: ShallowRef<number | null>
  /**
   * 获取响应的原始响应
   */
  response: ShallowRef<Response | null>
  /**
   * 可能发生的任何获取错误
   */
  error: ShallowRef<any>
  /**
   * 成功时的获取响应体，可能是 JSON 或文本
   */
  data: ShallowRef<T | null>
  /**
   * 指示请求当前是否正在获取
   */
  isFetching: Readonly<ShallowRef<boolean>>
  /**
   * 指示获取请求是否可以中止
   */
  canAbort: ComputedRef<boolean>
  /**
   * 指示获取请求是否已中止
   */
  aborted: ShallowRef<boolean>
  /**
   * 中止获取请求
   */
  abort: (reason?: any) => void
  /**
   * 手动调用获取
   *（默认不抛出错误）
   */
  execute: (throwOnFailed?: boolean) => Promise<any>
  /**
   * 获取请求完成后触发
   */
  onFetchResponse: EventHookOn<Response>
  /**
   * 获取请求错误后触发
   */
  onFetchError: EventHookOn
  /**
   * 获取完成后触发
   */
  onFetchFinally: EventHookOn
  get: () => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  post: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  put: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  delete: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  patch: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  head: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  options: (
    payload?: MaybeRefOrGetter<unknown>,
    type?: string,
  ) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  json: <JSON = any>() => UseFetchReturn<JSON> &
    PromiseLike<UseFetchReturn<JSON>>
  text: () => UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>
  blob: () => UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>
  arrayBuffer: () => UseFetchReturn<ArrayBuffer> &
    PromiseLike<UseFetchReturn<ArrayBuffer>>
  formData: () => UseFetchReturn<FormData> &
    PromiseLike<UseFetchReturn<FormData>>
}
type Combination = "overwrite" | "chain"
export interface BeforeFetchContext {
  /**
   * 当前请求的计算 URL
   */
  url: string
  /**
   * 当前请求的请求选项
   */
  options: RequestInit
  /**
   * 取消当前请求
   */
  cancel: Fn
}
export interface AfterFetchContext<T = any> {
  response: Response
  data: T | null
  context: BeforeFetchContext
  execute: (throwOnFailed?: boolean) => Promise<any>
}
export interface OnFetchErrorContext<T = any, E = any> {
  error: E
  data: T | null
  response: Response | null
  context: BeforeFetchContext
  execute: (throwOnFailed?: boolean) => Promise<any>
}
export interface UseFetchOptions {
  /**
   * 获取函数
   */
  fetch?: typeof window.fetch
  /**
   * 使用 `useFetch` 时自动运行获取
   *
   * @default true
   */
  immediate?: boolean
  /**
   * 自动重新获取当：
   * - 如果 URL 是 ref，URL 更改时
   * - 如果 payload 是 ref，payload 更改时
   *
   * @default false
   */
  refetch?: MaybeRefOrGetter<boolean>
  /**
   * 请求完成前的初始数据
   *
   * @default null
   */
  initialData?: any
  /**
   * 中止请求后的超时时间（毫秒）
   * `0` 表示使用浏览器默认值
   *
   * @default 0
   */
  timeout?: number
  /**
   * 允许在获取错误时更新 `data` ref，无论何时提供，或在 `onFetchError` 回调中修改
   *
   * @default false
   */
  updateDataOnError?: boolean
  /**
   * 在获取请求发送前立即运行
   */
  beforeFetch?: (
    ctx: BeforeFetchContext,
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void
  /**
   * 在获取请求返回后立即运行。
   * 在任何 2xx 响应后运行
   */
  afterFetch?: (
    ctx: AfterFetchContext,
  ) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
  /**
   * 在获取请求返回后立即运行。
   * 在任何 4xx 和 5xx 响应后运行
   */
  onFetchError?: (
    ctx: OnFetchErrorContext,
  ) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>
}
export interface CreateFetchOptions {
  /**
   * 将前缀到所有 URL 的基本 URL，除非 URL 是绝对的
   */
  baseUrl?: MaybeRefOrGetter<string>
  /**
   * 确定 beforeFetch、afterFetch、onFetchError 的继承行为
   * @default 'chain'
   */
  combination?: Combination
  /**
   * useFetch 函数的默认选项
   */
  options?: UseFetchOptions
  /**
   * 获取请求的选项
   */
  fetchOptions?: RequestInit
}
export declare function createFetch(
  config?: CreateFetchOptions,
): typeof useFetch
export declare function useFetch<T>(
  url: MaybeRefOrGetter<string>,
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
export declare function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  useFetchOptions: UseFetchOptions,
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
export declare function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: RequestInit,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
```
