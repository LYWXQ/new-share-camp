---
name: build-ssr
description: 使用 Vite 进行服务器端渲染设置和配置
---

# 服务器端渲染 (SSR)

面向框架作者的底层 API。对于应用程序，使用 [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr) 中的高级工具。

## 项目结构

```
├── index.html
├── server.js              # Express/Node 服务器
└── src/
    ├── main.js            # 通用应用代码
    ├── entry-client.js    # 将应用挂载到 DOM
    └── entry-server.js    # 使用 SSR API 渲染应用
```

## index.html

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <script type="module" src="/src/entry-client.js"></script>
  </body>
</html>
```

## 开发服务器

```ts
// server.js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  app.use(vite.middlewares)

  app.use('*all', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. 应用 Vite 转换
      template = await vite.transformIndexHtml(url, template)

      // 3. 加载服务器入口
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. 渲染应用 HTML
      const appHtml = await render(url)

      // 5. 注入到模板
      const html = template.replace('<!--ssr-outlet-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(5173)
}

createServer()
```

## 条件逻辑

```ts
if (import.meta.env.SSR) {
  // 仅服务器代码（在客户端被 tree-shaken）
}
```

## 生产构建

```json
{
  "scripts": {
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

### 生产服务器

```ts
// 与开发的区别：
// 1. 使用 dist/client/index.html 作为模板
// 2. 使用 import('./dist/server/entry-server.js') 代替 ssrLoadModule
// 3. 从 dist/client 提供静态文件
```

## SSR Manifest

用于预加载指令：

```bash
vite build --outDir dist/client --ssrManifest
```

生成 `dist/client/.vite/ssr-manifest.json`，包含模块到代码块的映射。

## SSR 外部依赖

依赖默认被外部化。要使用 Vite 转换：

```ts
export default defineConfig({
  ssr: {
    noExternal: ['需要转换的包'],
    external: ['要外部化的包']
  }
})
```

## SSR 特定插件逻辑

```ts
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // SSR 特定转换
      }
    }
  }
}
```

## SSR 目标

```ts
export default defineConfig({
  ssr: {
    target: 'node',      // 默认
    // target: 'webworker'  // 用于边缘运行时
  }
})
```

## SSR 打包

打包所有依赖（用于 workers）：

```ts
export default defineConfig({
  ssr: {
    noExternal: true  // 打包所有内容
  }
})
```

## 解析条件

```ts
export default defineConfig({
  ssr: {
    resolve: {
      conditions: ['node'],
      externalConditions: ['node']
    }
  }
})
```

## 预渲染 / SSG

在构建时使用已知数据将路由预渲染为静态 HTML。

<!-- 
Source references:
- https://vite.dev/guide/ssr.html
-->
