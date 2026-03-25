---
name: advanced-api
description: Vite 的 JavaScript API，用于程序化使用
---

# JavaScript API

Vite 的 API 完全支持类型。使用 TypeScript 或启用 JS 类型检查以获得智能提示。

## `createServer`

以编程方式创建开发服务器：

```ts
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  root: __dirname,
  server: {
    port: 1337
  }
})

await server.listen()
server.printUrls()
server.bindCLIShortcuts({ print: true })
```

### ViteDevServer 接口

```ts
interface ViteDevServer {
  config: ResolvedConfig
  middlewares: Connect.Server      // 用于自定义中间件的 Connect 应用
  httpServer: http.Server | null   // Node HTTP 服务器
  watcher: FSWatcher               // Chokidar 监视器
  ws: WebSocketServer              // 用于 HMR 的 WebSocket
  moduleGraph: ModuleGraph         // 模块导入关系
  
  // 无需 HTTP 进行转换
  transformRequest(url: string): Promise<TransformResult | null>
  
  // 应用 HTML 转换
  transformIndexHtml(url: string, html: string): Promise<string>
  
  // 为 SSR 加载模块
  ssrLoadModule(url: string): Promise<Record<string, any>>
  
  // 修复 SSR 错误堆栈跟踪
  ssrFixStacktrace(e: Error): void
  
  // 控制
  listen(port?: number): Promise<ViteDevServer>
  restart(): Promise<void>
  close(): Promise<void>
}
```

## `build`

构建生产环境：

```ts
import { build } from 'vite'

await build({
  root: './project',
  base: '/foo/',
  build: {
    rolldownOptions: {
      // ...
    }
  }
})
```

## `preview`

本地预览生产构建：

```ts
import { preview } from 'vite'

const previewServer = await preview({
  preview: {
    port: 8080,
    open: true
  }
})

previewServer.printUrls()
```

## `resolveConfig`

在不启动服务器的情况下解析配置：

```ts
import { resolveConfig } from 'vite'

const config = await resolveConfig(
  { root: './project' },
  'serve',        // 'serve' | 'build'
  'development'   // 默认模式
)
```

## `mergeConfig`

深度合并两个配置：

```ts
import { mergeConfig } from 'vite'

const merged = mergeConfig(baseConfig, overrideConfig)
```

合并回调配置：

```ts
import { defineConfig, mergeConfig } from 'vite'

export default defineConfig((env) =>
  mergeConfig(configAsCallback(env), configAsObject)
)
```

## `loadEnv`

加载 .env 文件：

```ts
import { loadEnv } from 'vite'

// 加载 VITE_* 变量
const env = loadEnv('development', process.cwd())

// 加载所有变量（空前缀）
const allEnv = loadEnv('development', process.cwd(), '')
```

## `searchForWorkspaceRoot`

查找 monorepo 工作区根目录：

```ts
import { searchForWorkspaceRoot } from 'vite'

const workspaceRoot = searchForWorkspaceRoot(process.cwd())
```

## `normalizePath`

跨平台规范化路径：

```ts
import { normalizePath } from 'vite'

normalizePath('foo\\bar')  // 'foo/bar'
```

## `transformWithOxc`

使用 Oxc Transformer 转换 JS/TS：

```ts
import { transformWithOxc } from 'vite'

const result = await transformWithOxc(
  code,
  'file.ts',
  { target: 'es2020' }
)
```

## `preprocessCSS`

预处理 CSS 文件：

```ts
import { preprocessCSS, resolveConfig } from 'vite'

const config = await resolveConfig({}, 'serve')
const result = await preprocessCSS(code, 'styles.scss', config)
// result.code - 纯 CSS
// result.modules - CSS 模块映射
```

## `loadConfigFromFile`

手动加载配置文件：

```ts
import { loadConfigFromFile } from 'vite'

const result = await loadConfigFromFile(
  { command: 'serve', mode: 'development' },
  'vite.config.ts'
)
// result.config, result.path, result.dependencies
```

## InlineConfig

扩展 UserConfig：

```ts
interface InlineConfig extends UserConfig {
  configFile?: string | false  // 配置文件路径或 false 跳过
  mode?: string
}
```

<!-- 
Source references:
- https://vite.dev/guide/api-javascript.html
-->
