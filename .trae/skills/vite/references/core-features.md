---
name: core-features
description: Vite 核心功能，包括 TypeScript、JSX、CSS 和 HTML 处理
---

# 核心功能

## TypeScript

Vite 通过 Oxc Transformer 开箱即用地支持 `.ts` 文件（比 tsc 快 20-30 倍）。

### 重要：仅转译

Vite 不执行类型检查。单独运行类型检查：

```bash
# 生产构建
tsc --noEmit && vite build

# 开发期间（单独进程）
tsc --noEmit --watch

# 或使用 vite-plugin-checker 进行浏览器错误报告
```

### TypeScript 配置

必需的 `tsconfig.json` 设置：

```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "useDefineForClassFields": true,
    "skipLibCheck": true
  }
}
```

### 客户端类型

添加 Vite 的客户端类型以支持 `import.meta.env` 和资源导入：

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

这为以下提供类型：
- 资源导入（`.svg`、`.png` 等）
- `import.meta.env` 常量
- `import.meta.hot` HMR API

### 自定义类型覆盖

覆盖默认资源导入类型：

```ts
// vite-env-override.d.ts
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}
```

### 使用 tsconfig 的路径别名

启用 tsconfig 路径解析：

```ts
// vite.config.ts
export default defineConfig({
  resolve: {
    tsconfigPaths: true
  }
})
```

## JSX

开箱即用地支持 `.jsx` 和 `.tsx` 文件。自定义 JSX 配置：

```ts
export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'classic',  // 或 'automatic'
      pragma: 'h',
      pragmaFrag: 'Fragment'
    },
    // 自动注入 JSX 辅助函数
    jsxInject: `import React from 'react'`
  }
})
```

## HTML

`index.html` 是入口点，不是放在 `public/` 中。Vite 将其作为模块图的一部分进行处理。

### 支持的元素

Vite 处理这些 HTML 元素属性：

- `<script type="module" src>`
- `<link href>`（样式表）
- `<img src>`、`<img srcset>`
- `<video src>`、`<video poster>`
- `<audio src>`
- `<source src>`、`<source srcset>`
- `<meta content>`（用于 og:image、twitter:image 等）

### 选择退出处理

```html
<script vite-ignore type="module" src="https://cdn.example.com/lib.js"></script>
```

### 多页面应用

通过路径访问任何 HTML 文件：

- `<root>/index.html` → `http://localhost:5173/`
- `<root>/about.html` → `http://localhost:5173/about.html`
- `<root>/blog/index.html` → `http://localhost:5173/blog/index.html`

## JSON

直接导入并支持命名导出：

```ts
// 导入整个对象
import json from './data.json'

// 命名导入（可 tree-shake）
import { field } from './data.json'
```

## 框架支持

官方框架插件：

| 框架 | 插件 |
|------|------|
| Vue 3 | `@vitejs/plugin-vue` |
| Vue 3 JSX | `@vitejs/plugin-vue-jsx` |
| React | `@vitejs/plugin-react` |
| React (SWC) | `@vitejs/plugin-react-swc` |
| React Server Components | `@vitejs/plugin-rsc` |
| 旧版浏览器 | `@vitejs/plugin-legacy` |

## 内容安全策略

为 CSP 配置 nonce：

```ts
export default defineConfig({
  html: {
    cspNonce: 'PLACEHOLDER'  // 每个请求替换
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/features.html
-->
