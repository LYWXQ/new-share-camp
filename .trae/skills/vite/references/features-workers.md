---
name: features-workers
description: Vite 中的 Web Worker 支持
---

# Web Workers

## 构造函数语法（推荐）

标准 Web Worker 创建：

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

模块 Worker：

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})
```

共享 Worker：

```ts
const sharedWorker = new SharedWorker(
  new URL('./shared-worker.js', import.meta.url)
)
```

**注意：** `new URL()` 必须直接在 `new Worker()` 内部使用以便检测。

## 查询后缀语法

使用 `?worker` 后缀导入：

```ts
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

共享 Worker：

```ts
import MySharedWorker from './worker?sharedworker'

const worker = new MySharedWorker()
```

### 内联 Worker

内联为 base64 字符串（无单独代码块）：

```ts
import MyWorker from './worker?worker&inline'

const worker = new MyWorker()
```

### 仅 Worker URL

获取 URL 而非构造函数：

```ts
import workerUrl from './worker?worker&url'
```

## Worker 脚本

Worker 可以使用 ESM `import` 语句：

```ts
// worker.js
import { heavyComputation } from './utils'

self.onmessage = (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
}
```

## Worker 选项

配置 Worker 打包：

```ts
// vite.config.ts
export default defineConfig({
  worker: {
    format: 'es',  // 或 'iife'
    plugins: () => [/* Worker 专用插件 */],
    rollupOptions: {
      // Worker 打包的 Rollup 选项
    }
  }
})
```

## Worker 中的 WebAssembly

```ts
// worker.js
import init from './module.wasm?init'

init().then((instance) => {
  instance.exports.compute()
})
```

<!-- 
Source references:
- https://vite.dev/guide/features.html#web-workers
-->
