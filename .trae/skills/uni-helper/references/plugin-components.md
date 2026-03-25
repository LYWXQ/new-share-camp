---
name: vite-plugin-uni-components
description: uni-app 按需自动组件导入 - 源自 unplugin-vue-components，做什么：自动从 src/components 导入组件，支持 UI 库解析器和 TypeScript 声明生成；何时调用：当用户需要配置自动组件导入、使用 UI 库解析器（如 uni-ui、wot-design-uni）或生成组件 TypeScript 声明时调用
---

# vite-plugin-uni-components

uni-app 的按需自动组件导入。源自 unplugin-vue-components，并针对 uni-app 进行了适配。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-components
```

## 设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components(),  // 必须在 Uni() 之前
    Uni(),
  ],
})
```

## 特性

- 自动从 `src/components` 导入组件
- 支持 UI 库解析器
- 生成 TypeScript 声明
- 处理第三方 UI 库的 `default` 导出

## 支持的 UI 库

内置解析器：

| 库 | 导入 |
|---------|--------|
| Ano UI | `AnoUIResolver()` |
| uni-ui | `UniUIResolver()` |
| wot-design-uni | `WotDesignUniResolver()` |
| uv-uni | `UvUniResolver()` |
| uview-pro | `UviewProResolver()` |
| z-paging | `ZPagingResolver()` |

## TypeScript 声明

对于 pnpm 用户，创建 `.npmrc`：

```ini
shamefully-hoist = true
```

生成的 `components.d.ts` 示例：

```ts
declare module 'vue' {
  export interface GlobalComponents {
    AButton: typeof import('ano-ui/components/AButton/AButton.vue')['default']
    UniCalendar: typeof import('@dcloudio/uni-ui/lib/uni-calendar/uni-calendar.vue')['default']
    MyComponent: typeof import('./src/components/MyComponent.vue')['default']
  }
}
```

## 第三方组件处理

对于 `@dcloudio/uni-ui` 和 `ano-ui` 等第三方组件，插件会自动添加 `default` 属性以处理 H5 兼容性问题：

```diff
declare module 'vue' {
  export interface GlobalComponents {
-   AButton: typeof import('ano-ui/components/AButton/AButton.vue')['AButton']
+   AButton: typeof import('ano-ui/components/AButton/AButton.vue')['default']
  }
}
```

## 完整配置

请参阅 [unplugin-vue-components 文档](https://github.com/antfu/unplugin-vue-components) 了解所有选项。

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-components
- https://uni-helper.js.org/vite-plugin-uni-components
-->
