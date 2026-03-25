---
name: core-config
description: Vite 配置文件设置、defineConfig 辅助函数、条件和异步配置
---

# Vite 配置

Vite 自动解析项目根目录中名为 `vite.config.*` 的配置文件。

## 基本配置

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // 配置选项
})
```

使用 `defineConfig` 获得 TypeScript 智能提示。或者使用 JSDoc 注解：

```js
/** @type {import('vite').UserConfig} */
export default {
  // 配置选项
}
```

## 条件配置

导出一个函数以根据命令、模式或构建类型条件确定选项：

```ts
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    // 开发特定配置
    return {
      define: {
        __DEV__: true
      }
    }
  } else {
    // 构建特定配置
    return {
      define: {
        __DEV__: false
      }
    }
  }
})
```

- `command` 在开发期间（`vite`、`vite dev`、`vite serve`）为 `'serve'`，生产构建时为 `'build'`
- `mode` 默认为 serve 的 `'development'`，build 的 `'production'`

## 异步配置

```ts
import { defineConfig } from 'vite'

export default defineConfig(async ({ command, mode }) => {
  const data = await fetchRemoteConfig()
  return {
    // 使用获取的数据进行配置
  }
})
```

## 关键配置选项

### 根目录和基础路径

```ts
export default defineConfig({
  root: './src',           // 项目根目录（index.html 所在位置）
  base: '/my-app/',        // 资源的公共基础路径
  publicDir: 'public',     // 静态资源目录
  cacheDir: 'node_modules/.vite'  // 缓存目录
})
```

### 解析别名

```ts
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/components')
    },
    // 尝试无扩展名导入的文件扩展名
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  }
})
```

### 定义全局常量

```ts
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __API_URL__: JSON.stringify('https://api.example.com')
  }
})
```

值必须是 JSON 可序列化的或单个标识符。添加 TypeScript 声明：

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
declare const __API_URL__: string
```

### JSON 处理

```ts
export default defineConfig({
  json: {
    namedExports: true,  // 支持从 JSON 命名导入
    stringify: 'auto'    // 为性能将大型 JSON 字符串化
  }
})
```

## 在配置中使用环境变量

`.env` 文件中的变量不会自动在配置中可用。使用 `loadEnv`：

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 从 .env 文件加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173
    }
  }
})
```

## 指定配置文件

```bash
vite --config my-config.ts
```

## 配置加载方法

```bash
# 默认：使用 Rolldown 打包（在 monorepo 中可能有问题）
vite

# 使用模块运行器（无临时文件，即时转换）
vite --configLoader runner

# 使用原生运行时（需要支持 TypeScript 的 Node.js）
vite --configLoader native
```

<!-- 
Source references:
- https://vite.dev/config/
-->
