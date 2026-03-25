---
name: features-css
description: Vite 中的 CSS 处理，包括模块、预处理器、PostCSS 和 Lightning CSS
---

# CSS 处理

Vite 提供丰富的 CSS 支持，包括 HMR、`@import` 内联和自动 URL 重新定位。

## 基本 CSS 导入

```ts
import './styles.css'  // 注入页面并支持 HMR
```

## CSS 模块

以 `.module.css` 结尾的文件被视为 CSS 模块：

```css
/* example.module.css */
.red {
  color: red;
}
```

```ts
import classes from './example.module.css'
element.className = classes.red
```

### 使用 camelCase 的命名导入

```ts
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
})
```

```ts
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
```

## CSS 预处理器

安装预处理器，无需 Vite 插件：

```bash
# Sass（推荐 sass-embedded 以获得性能）
npm add -D sass-embedded

# Less
npm add -D less

# Stylus
npm add -D stylus
```

通过文件扩展名使用：

```ts
import './styles.scss'
import './styles.less'
import './styles.styl'
```

### 预处理器选项

```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
        importers: [/* ... */]
      },
      less: {
        math: 'parens-division'
      }
    },
    preprocessorMaxWorkers: true  // 使用多线程
  }
})
```

### 与 CSS 模块结合

```ts
import styles from './component.module.scss'
```

## PostCSS

如果存在 `postcss.config.js` 则自动应用：

```js
// postcss.config.js
export default {
  plugins: [
    require('postcss-nesting'),
    require('autoprefixer')
  ]
}
```

或内联配置：

```ts
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssNesting(),
        autoprefixer()
      ]
    }
  }
})
```

## Lightning CSS

实验性更快的 CSS 处理：

```bash
npm add -D lightningcss
```

```ts
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 111
      },
      cssModules: {
        // Lightning CSS 模块配置
      }
    }
  }
})
```

仅使用 Lightning CSS 进行压缩：

```ts
export default defineConfig({
  build: {
    cssMinify: 'lightningcss'
  }
})
```

## 禁用 CSS 注入

导入 CSS 作为字符串而不注入：

```ts
import styles from './styles.css?inline'  // 返回 CSS 字符串，不注入
```

## Source Maps

在开发中启用 CSS source maps：

```ts
export default defineConfig({
  css: {
    devSourcemap: true
  }
})
```

## CSS 代码分割

默认情况下，CSS 为每个异步块提取。禁用以获得单个 CSS 文件：

```ts
export default defineConfig({
  build: {
    cssCodeSplit: false  // 整个应用的单个 CSS 文件
  }
})
```

## CSS 目标

为 CSS 设置不同的浏览器目标：

```ts
export default defineConfig({
  build: {
    cssTarget: 'chrome61'  // 用于 Android 微信 WebView
  }
})
```

## @import 和 URL 处理

- `@import` 语句自动内联
- Vite 别名在 `@import` 中有效
- `url()` 引用被重新定位以确保正确性
- 适用于不同目录中的 Sass/Less 文件

<!-- 
Source references:
- https://vite.dev/guide/features.html#css
-->
