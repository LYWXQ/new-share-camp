---
name: core-plugins
description: 添加、配置和排序 Vite 插件
---

# 使用插件

Vite 使用额外的 Vite 特定选项扩展了 Rolldown 的插件接口。

## 添加插件

安装并添加到配置：

```bash
npm add -D @vitejs/plugin-vue
```

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()]
})
```

## 插件数组

插件可以返回数组（用于复杂功能）：

```ts
// 返回多个插件的框架插件
export default function framework(config) {
  return [
    frameworkRefresh(config),
    frameworkDevtools(config)
  ]
}
```

## 条件插件

假值被忽略：

```ts
export default defineConfig({
  plugins: [
    vue(),
    process.env.ANALYZE && visualizer()  // 仅在设置 ANALYZE 时
  ]
})
```

## 强制插件顺序

控制插件相对于 Vite 核心的运行时机：

```ts
export default defineConfig({
  plugins: [
    {
      ...somePlugin(),
      enforce: 'pre'  // 在 Vite 核心插件之前
    },
    {
      ...anotherPlugin(),
      enforce: 'post'  // 在 Vite 构建插件之后
    }
  ]
})
```

**顺序：**
1. 别名
2. 带有 `enforce: 'pre'` 的插件
3. Vite 核心插件
4. 没有 enforce 的插件
5. Vite 构建插件
6. 带有 `enforce: 'post'` 的插件
7. Vite 构建后插件（压缩、manifest）

## 条件应用

仅在 serve 或 build 期间应用：

```ts
export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'  // 仅在构建期间
    },
    {
      ...devOnlyPlugin(),
      apply: 'serve'  // 仅在开发期间
    }
  ]
})
```

函数形式以获得更多控制：

```ts
{
  ...myPlugin(),
  apply(config, { command }) {
    // 仅在构建期间应用，但不用于 SSR
    return command === 'build' && !config.build.ssr
  }
}
```

## 查找插件

1. 查看 [Vite 功能指南](https://vite.dev/guide/features.html) - 许多用例是内置的
2. [Vite 插件](https://vite.dev/plugins/) 中的官方插件
3. [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) 中的社区插件
4. 搜索 npm 中的 `vite-plugin-*` 或 `rollup-plugin-*`

## 官方插件

| 插件 | 用途 |
|------|------|
| `@vitejs/plugin-vue` | Vue 3 SFC 支持 |
| `@vitejs/plugin-vue-jsx` | Vue 3 JSX 支持 |
| `@vitejs/plugin-react` | 使用 Babel/Oxc 的 React |
| `@vitejs/plugin-react-swc` | 使用 SWC 的 React |
| `@vitejs/plugin-rsc` | React Server Components |
| `@vitejs/plugin-legacy` | 旧版浏览器支持 |

## Rollup/Rolldown 插件兼容性

许多 Rollup 插件可以直接与 Vite 一起使用，如果它们：
- 不使用 `moduleParsed` 钩子
- 不依赖 Rolldown 特定选项
- 在 bundle 和 output 阶段之间没有强耦合

对于仅用于构建的 Rollup 插件：

```ts
export default defineConfig({
  build: {
    rolldownOptions: {
      plugins: [rollupPluginForBuildOnly()]
    }
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/using-plugins.html
-->
