---
name: advanced-performance
description: Vite 开发服务器和构建的性能优化技巧
---

# 性能优化

## 浏览器设置

- 使用仅用于开发的浏览器配置文件，不安装扩展
- 使用 Vite 时在 DevTools 中禁用"禁用缓存"
- 扩展可能会干扰请求并降低启动速度

## 审计插件性能

1. **延迟加载大型依赖** 在插件中
2. **避免长时间操作** 在 `buildStart`、`config`、`configResolved` 中
3. **优化 transform 钩子** - 在处理前检查 `id` 扩展名

调试转换时间：

```bash
vite --debug plugin-transform
```

使用 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 检查转换。

## 性能分析

```bash
vite --profile
# 访问网站，按 'p + enter' 记录 .cpuprofile
# 在 https://www.speedscope.app 中打开
```

## 减少解析操作

明确指定扩展名以避免文件系统检查：

```ts
// 慢：检查 .mjs, .js, .mts, .ts, .jsx, .tsx, .json
import Component from './Component'

// 快：直接命中
import Component from './Component.tsx'
```

为明确导入启用 TypeScript 路径解析：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

## 避免 Barrel 文件

Barrel 文件（`index.js` 重新导出所有内容）会导致加载所有文件：

```ts
// 慢：加载所有 utils
import { slash } from './utils'

// 快：仅加载 slash.js
import { slash } from './utils/slash.js'
```

## 预热常用文件

预转换始终加载的文件：

```ts
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js'
      ],
      ssrFiles: ['./src/server/modules/*.js']
    }
  }
})
```

查找要预热的文件：

```bash
vite --debug transform
```

## 使用原生/更少工具

**减少工作量：**
- 使用 CSS 而非 Sass/Less（PostCSS 有嵌套支持）
- 不要将 SVG 转换为组件 - 作为字符串/URL 导入
- 如果不需要，跳过 `@vitejs/plugin-react` 中的 Babel

**使用原生工具：**
- 尝试使用 Lightning CSS 进行更快的 CSS 处理

```ts
export default defineConfig({
  css: {
    transformer: 'lightningcss'
  }
})
```

## 服务器选项

### 自动打开浏览器

触发入口点预热：

```ts
export default defineConfig({
  server: {
    open: true
  }
})
```

### 限制文件监视

```ts
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/large-folder/**']
    }
  }
})
```

## 构建性能

### 禁用报告

对于大型项目跳过 gzip 大小计算：

```ts
export default defineConfig({
  build: {
    reportCompressedSize: false
  }
})
```

### Sourcemaps

如果不需要则禁用：

```ts
export default defineConfig({
  build: {
    sourcemap: false
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/performance.html
-->
