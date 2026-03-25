---
name: advanced-backend
description: 将 Vite 与传统后端框架集成
---

# 后端集成

将 Vite 与传统后端（Rails、Laravel 等）集成以提供资源服务。

## 配置

```ts
// vite.config.ts
export default defineConfig({
  server: {
    cors: {
      origin: 'http://my-backend.example.com'
    }
  },
  build: {
    manifest: true,  // 生成 .vite/manifest.json
    rolldownOptions: {
      input: '/path/to/main.js'  // 覆盖 HTML 入口
    }
  }
})
```

在入口中导入 polyfill：

```ts
// main.js
import 'vite/modulepreload-polyfill'
```

## 开发环境

在后端模板中注入 Vite 客户端和入口：

```html
<!-- 仅开发环境 -->
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/main.js"></script>
```

### React 设置

在其他脚本之前添加：

```html
<script type="module">
  import RefreshRuntime from 'http://localhost:5173/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
```

### 资源代理

选择以下方式之一：
1. 将静态资源请求代理到 Vite
2. 设置 `server.origin`：

```ts
export default defineConfig({
  server: {
    origin: 'http://localhost:5173'
  }
})
```

## 生产环境

构建生成 `.vite/manifest.json`：

```json
{
  "views/foo.js": {
    "file": "assets/foo-BRBmoGS9.js",
    "src": "views/foo.js",
    "isEntry": true,
    "imports": ["_shared-B7PI925R.js"],
    "css": ["assets/foo-5UjPuW-k.css"]
  },
  "_shared-B7PI925R.js": {
    "file": "assets/shared-B7PI925R.js",
    "css": ["assets/shared-ChJ_j-JJ.css"]
  }
}
```

## 渲染标签

对于入口 `views/foo.js`，按以下顺序渲染：

```html
<!-- 1. 入口 CSS -->
<link rel="stylesheet" href="/assets/foo-5UjPuW-k.css" />

<!-- 2. 导入块的 CSS（递归） -->
<link rel="stylesheet" href="/assets/shared-ChJ_j-JJ.css" />

<!-- 3. 入口脚本 -->
<script type="module" src="/assets/foo-BRBmoGS9.js"></script>

<!-- 4. 可选：预加载导入 -->
<link rel="modulepreload" href="/assets/shared-B7PI925R.js" />
```

## Manifest 结构

```ts
interface ManifestChunk {
  src?: string           // 输入文件名
  file: string          // 输出文件名
  css?: string[]        // CSS 文件（仅限 JS 块）
  assets?: string[]     // 非 CSS 资源（仅限 JS 块）
  isEntry?: boolean     // 是否为入口点
  isDynamicEntry?: boolean  // 是否为动态导入
  imports?: string[]    // 静态导入（manifest 键）
  dynamicImports?: string[]  // 动态导入（manifest 键）
}
```

## 处理导入

递归收集所有导入的块：

```ts
function getImportedChunks(manifest, name) {
  const seen = new Set()
  const chunks = []
  
  function collect(chunk) {
    for (const file of chunk.imports ?? []) {
      if (seen.has(file)) continue
      seen.add(file)
      
      const importee = manifest[file]
      collect(importee)
      chunks.push(importee)
    }
  }
  
  collect(manifest[name])
  return chunks
}
```

## 现有集成

查看 [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends) 了解：
- Laravel (laravel-vite)
- Rails
- Django
- Flask
- 等等

<!-- 
Source references:
- https://vite.dev/guide/backend-integration.html
-->
