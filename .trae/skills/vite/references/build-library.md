---
name: build-library
description: 使用 Vite 构建库，包括正确的 package.json 导出配置
---

# 库模式

构建面向浏览器的库以进行分发。

## 基本配置

```ts
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',           // UMD 的全局变量名
      fileName: 'my-lib'       // 输出文件名（不带扩展名）
    },
    rolldownOptions: {
      external: ['vue'],       // 不打包这些
      output: {
        globals: {
          vue: 'Vue'           // UMD 中外部依赖的全局变量
        }
      }
    }
  }
})
```

## 多个入口点

```ts
export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        'secondary': resolve(__dirname, 'lib/secondary.js')
      },
      name: 'MyLib'
    }
  }
})
```

## 输出格式

单个入口默认值：`['es', 'umd']`
多个入口默认值：`['es', 'cjs']`

```ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      formats: ['es', 'cjs', 'umd', 'iife']
    }
  }
})
```

## 自定义文件名

```ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      cssFileName: 'styles'  // 用于打包的 CSS
    }
  }
})
```

## Package.json 配置

### 单个入口

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

### 多个入口

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

### 带 CSS

```json
{
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

## 库入口文件

```ts
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'

export { Foo, Bar }
```

## 环境变量

在库模式中：
- `import.meta.env.*` 被静态替换
- `process.env.*` 不会被替换（使用者可以更改）

要替换 `process.env`：

```ts
export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
```

## 注意事项

- `assetsInlineLimit` 被忽略 - 资源始终内联
- `cssCodeSplit` 默认为 `false`
- 对于非浏览器库，考虑使用 [tsdown](https://tsdown.dev/) 或直接使用 Rolldown

<!-- 
Source references:
- https://vite.dev/guide/build.html#library-mode
-->
