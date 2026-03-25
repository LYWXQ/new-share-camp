---
name: features-hmr
description: Vite 的热模块替换 (HMR) 客户端 API
---

# HMR API

HMR API 通过 `import.meta.hot` 暴露。主要用于框架和工具作者。

## 条件守卫

始终为生产中的 tree-shaking 守卫 HMR 代码：

```ts
if (import.meta.hot) {
  // HMR 代码
}
```

## TypeScript 支持

添加到 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## 自接受模块

模块处理自己的更新：

```ts
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      console.log('已更新: count 现在是', newModule.count)
    }
  })
}
```

## 接受依赖更新

响应依赖项的更改而不重新加载自身：

```ts
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  // 单个依赖
  import.meta.hot.accept('./foo.js', (newFoo) => {
    newFoo?.foo()
  })
  
  // 多个依赖
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // 处理更新
    }
  )
}
```

## 更新时清理

在模块被替换前清理副作用：

```ts
function setupSideEffect() {
  const interval = setInterval(() => {}, 1000)
  return interval
}

const interval = setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    clearInterval(interval)
  })
}
```

## 清理回调

模块不再被导入时调用：

```ts
if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 模块从页面中移除时清理
  })
}
```

## 持久数据

在模块实例之间传递数据：

```ts
if (import.meta.hot) {
  // 修改属性，不要重新赋值 data 本身
  import.meta.hot.data.count = (import.meta.hot.data.count || 0) + 1
}
```

## 失效

强制传播到导入者：

```ts
if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    if (cannotHandleUpdate(module)) {
      import.meta.hot.invalidate()  // 传播到导入者
    }
  })
}
```

## HMR 事件

监听内置事件：

```ts
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', (payload) => {
    console.log('更新即将到来')
  })
  
  import.meta.hot.on('vite:afterUpdate', (payload) => {
    console.log('更新已应用')
  })
  
  import.meta.hot.on('vite:beforeFullReload', () => {
    console.log('完全重新加载')
  })
  
  import.meta.hot.on('vite:error', (error) => {
    console.error('HMR 错误', error)
  })
  
  import.meta.hot.on('vite:ws:connect', () => {
    console.log('WebSocket 已连接')
  })
  
  import.meta.hot.on('vite:ws:disconnect', () => {
    console.log('WebSocket 已断开')
  })
}
```

## 自定义事件

向服务器发送事件：

```ts
// 客户端
if (import.meta.hot) {
  import.meta.hot.send('my:event', { msg: '来自客户端的问候' })
}
```

从服务器接收：

```ts
// 客户端
if (import.meta.hot) {
  import.meta.hot.on('my:response', (data) => {
    console.log(data.msg)
  })
}
```

## 自定义事件的 TypeScript

```ts
// events.d.ts
import 'vite/types/customEvent.d.ts'

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'my:event': { msg: string }
    'my:response': { msg: string }
  }
}
```

<!-- 
Source references:
- https://vite.dev/guide/api-hmr.html
-->
