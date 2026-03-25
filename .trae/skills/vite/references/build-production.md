---
name: build-production
description: 生产环境构建，包括目标浏览器、多页面应用和优化
---

# 生产构建

## 基本构建

```bash
vite build
```

使用 `<root>/index.html` 作为入口点，输出到 `dist/`。

## 浏览器兼容性

默认目标：Baseline Widely Available 浏览器（Chrome 111+、Edge 111+、Firefox 114+、Safari 16.4+）。

```ts
export default defineConfig({
  build: {
    target: 'es2020',  // 或特定浏览器
    // target: ['chrome64', 'firefox78', 'safari12']
  }
})
```

对于旧版浏览器：

```bash
npm add -D @vitejs/plugin-legacy
```

```ts
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

## 输出配置

```ts
export default defineConfig({
  build: {
    outDir: 'dist',           // 输出目录
    assetsDir: 'assets',      // 资源子目录
    emptyOutDir: true,        // 构建前清空 outDir
    sourcemap: true,          // 生成 sourcemaps
    // sourcemap: 'inline' | 'hidden'
  }
})
```

## 公共基础路径

用于部署到子路径：

```ts
export default defineConfig({
  base: '/my-app/'
})
```

相对基础路径（在任何地方都可用）：

```ts
export default defineConfig({
  base: './'
})
```

在代码中访问：

```ts
const base = import.meta.env.BASE_URL
```

## 多页面应用

```ts
import { resolve } from 'path'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

## 压缩

```ts
export default defineConfig({
  build: {
    minify: 'oxc',     // 默认，最快
    // minify: 'terser',  // 更多选项，较慢
    // minify: false,     // 禁用
    
    terserOptions: {   // 如果使用 terser
      compress: {
        drop_console: true
      }
    }
  }
})
```

## 代码分割策略

```ts
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // 手动代码块配置
        }
      }
    },
    chunkSizeWarningLimit: 500  // KB
  }
})
```

## CSS 选项

```ts
export default defineConfig({
  build: {
    cssCodeSplit: true,         // 每个异步块一个 CSS
    cssMinify: 'lightningcss',  // 或 'esbuild'
    cssTarget: 'chrome61'       // 与 JS 目标不同
  }
})
```

## 资源处理

```ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,    // 小于 4KB 的资源内联为 base64
    copyPublicDir: true         // 将 public/ 复制到 outDir
  }
})
```

## Manifest

为后端集成生成 manifest：

```ts
export default defineConfig({
  build: {
    manifest: true  // .vite/manifest.json
  }
})
```

## 监视模式

文件更改时重新构建：

```bash
vite build --watch
```

```ts
export default defineConfig({
  build: {
    watch: {}  // 以编程方式启用
  }
})
```

## 加载错误处理

处理动态导入失败（例如部署后）：

```ts
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload()
})
```

## 构建优化（自动）

- **CSS 代码分割** - 每个异步块一个 CSS
- **预加载指令** - `<link rel="modulepreload">`
- **异步块优化** - 并行获取依赖项

## 许可证生成

为依赖项生成许可证文件：

```ts
export default defineConfig({
  build: {
    license: true  // .vite/license.md
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/build.html
- https://vite.dev/config/build-options.html
-->
