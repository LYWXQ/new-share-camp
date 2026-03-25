---
name: features-env
description: Vite 中的环境变量、.env 文件和模式
---

# 环境变量和模式

## 内置常量

通过 `import.meta.env` 可用：

| 常量 | 描述 |
|------|------|
| `import.meta.env.MODE` | 应用模式（`'development'` 或 `'production'`） |
| `import.meta.env.BASE_URL` | 来自 `base` 配置的基础 URL |
| `import.meta.env.PROD` | 生产环境为 `true` |
| `import.meta.env.DEV` | 开发环境为 `true` |
| `import.meta.env.SSR` | 服务器端渲染为 `true` |

```ts
if (import.meta.env.DEV) {
  console.log('开发模式')
  // 在生产中被 tree-shaken
}
```

## 自定义环境变量

只有以 `VITE_` 为前缀的变量会暴露给客户端代码：

```bash
# .env
VITE_API_URL=https://api.example.com
DB_PASSWORD=secret  # 不会暴露给客户端
```

```ts
console.log(import.meta.env.VITE_API_URL)  // "https://api.example.com"
console.log(import.meta.env.DB_PASSWORD)   // undefined
```

### 自定义前缀

```ts
export default defineConfig({
  envPrefix: ['VITE_', 'APP_']  // 暴露 VITE_* 和 APP_*
})
```

## .env 文件

加载顺序（后面的优先级更高）：

```
.env                # 始终加载
.env.local          # 始终加载，gitignored
.env.[mode]         # 仅在指定模式
.env.[mode].local   # 仅在指定模式，gitignored
```

### 变量扩展

```bash
# .env
KEY=123
EXPANDED=test$KEY   # test123
ESCAPED=test\$foo   # test$foo（转义）
```

## 模式

```bash
# 开发模式（开发默认）
vite

# 生产模式（构建默认）
vite build

# 自定义模式
vite build --mode staging
```

创建模式特定的 env 文件：

```bash
# .env.staging
VITE_APP_TITLE=My App (staging)
NODE_ENV=production  # 仍然是生产构建
```

### NODE_ENV vs 模式

| 命令 | NODE_ENV | 模式 |
|------|----------|------|
| `vite build` | `production` | `production` |
| `vite build --mode development` | `production` | `development` |
| `NODE_ENV=development vite build` | `development` | `production` |

## TypeScript 智能提示

为自定义环境变量创建类型声明：

```ts
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

严格类型（禁止未知键）：

```ts
interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}
```

## HTML 替换

在 HTML 中使用 `%VARIABLE%` 语法：

```html
<title>%VITE_APP_TITLE%</title>
<p>模式: %MODE%</p>
```

不存在的变量保持原样（不会被替换为 `undefined`）。

## 在配置中加载环境变量

环境变量不会自动在 `vite.config.ts` 中可用：

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')  // '' 加载所有变量
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    }
  }
})
```

## 安全注意事项

- 将 `*.local` 添加到 `.gitignore`
- `VITE_*` 变量最终会进入客户端包 - 不要放机密
- 永远不要将 `envPrefix` 设置为 `''`（会暴露所有内容）

<!-- 
Source references:
- https://vite.dev/guide/env-and-mode.html
-->
