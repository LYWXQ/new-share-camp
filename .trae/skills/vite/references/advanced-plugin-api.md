---
name: advanced-plugin-api
description: 创建 Vite 插件、钩子、虚拟模块和客户端-服务器通信
---

# 插件 API

Vite 插件扩展了 Rolldown 的插件接口，添加了 Vite 特定的钩子。

## 基本插件结构

```ts
export default function myPlugin(options = {}) {
  return {
    name: 'vite-plugin-my-plugin',
    
    // 钩子...
  }
}
```

## 命名约定

- Vite 专用插件：`vite-plugin-*`
- Rollup 兼容：`rollup-plugin-*`
- 框架特定：`vite-plugin-vue-*`、`vite-plugin-react-*`

## 通用钩子（来自 Rolldown）

在服务器启动时调用：
- `options` - 修改 Rolldown 选项
- `buildStart` - 构建开始

每个模块请求时调用：
- `resolveId` - 解析导入路径
- `load` - 加载模块内容
- `transform` - 转换模块代码

在服务器关闭时调用：
- `buildEnd`
- `closeBundle`

## Vite 特定钩子

### `config`

在解析前修改配置：

```ts
{
  name: 'modify-config',
  config(config, { command, mode }) {
    if (command === 'build') {
      return {
        resolve: {
          alias: { foo: 'bar' }
        }
      }
    }
  }
}
```

### `configResolved`

访问最终解析的配置：

```ts
{
  name: 'read-config',
  configResolved(config) {
    this.config = config
  }
}
```

### `configureServer`

添加开发服务器中间件：

```ts
{
  name: 'configure-server',
  configureServer(server) {
    // 在 Vite 中间件之前
    server.middlewares.use((req, res, next) => {
      // 处理请求
      next()
    })
    
    // 返回函数在 Vite 中间件之后运行
    return () => {
      server.middlewares.use((req, res, next) => {
        // 后置中间件
      })
    }
  }
}
```

### `transformIndexHtml`

转换 HTML 文件：

```ts
{
  name: 'html-transform',
  transformIndexHtml(html) {
    return html.replace(/<title>(.*?)<\/title>/, '<title>新标题</title>')
  }
}
```

注入标签：

```ts
{
  name: 'html-inject',
  transformIndexHtml() {
    return {
      tags: [
        {
          tag: 'script',
          attrs: { src: '/inject.js' },
          injectTo: 'body'  // 'head' | 'body' | 'head-prepend' | 'body-prepend'
        }
      ]
    }
  }
}
```

### `handleHotUpdate`

自定义 HMR 处理：

```ts
{
  name: 'custom-hmr',
  handleHotUpdate({ file, server, modules }) {
    if (file.endsWith('.custom')) {
      server.ws.send({
        type: 'custom',
        event: 'custom-update',
        data: { file }
      })
      return []  // 阻止默认 HMR
    }
  }
}
```

## 虚拟模块

向源代码提供构建时信息：

```ts
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedId = '\0' + virtualModuleId

  return {
    name: 'virtual-module',
    
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedId
      }
    },
    
    load(id) {
      if (id === resolvedId) {
        return `export const msg = "来自虚拟模块"`
      }
    }
  }
}
```

使用：

```ts
import { msg } from 'virtual:my-module'
```

## 客户端-服务器通信

### 服务器到客户端

```ts
{
  configureServer(server) {
    server.ws.on('connection', () => {
      server.ws.send('my:greetings', { msg: 'hello' })
    })
  }
}
```

客户端接收：

```ts
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg)
  })
}
```

### 客户端到服务器

```ts
// 客户端
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: '嗨！' })
}

// 服务器（在插件中）
{
  configureServer(server) {
    server.ws.on('my:from-client', (data, client) => {
      console.log(data.msg)
      client.send('my:reply', { msg: '收到！' })
    })
  }
}
```

## 带过滤的转换

```ts
{
  name: 'transform-js',
  transform: {
    filter: {
      id: /\.js$/  // 仅 .js 文件
    },
    handler(code, id) {
      return transformCode(code)
    }
  }
}
```

## 路径规范化

为跨平台兼容性使用 POSIX 分隔符：

```ts
import { normalizePath } from 'vite'

normalizePath('foo\\bar')  // 'foo/bar'
```

<!-- 
Source references:
- https://vite.dev/guide/api-plugin.html
-->
