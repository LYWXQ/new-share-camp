---
name: uni-helper
description: uni-helper 生态系统综合技能参考 - 用于 uni-app 的 AI 驱动开发工具，做什么：提供 Vite 插件、工具库、TypeScript 支持和开发工具以增强 uni-app 开发体验；何时调用：当用户需要配置或使用 uni-helper 生态系统的任何工具（包括 vite-plugin-uni-pages、vite-plugin-uni-layouts、uni-use、uni-network 等）时调用
metadata:
  author: FlippeDround
  version: "2026.1.30"
  source: Generated from https://github.com/uni-helper/website, skills located at https://github.com/uni-helper/ai-tools
---

> 本技能基于 uni-helper 文档生成，生成时间为 2026-01-30。

uni-helper 是一套用于 uni-app 的 AI 驱动开发工具生态系统，提供 Vite 插件、工具库、TypeScript 支持和开发工具，以增强 uni-app 开发体验。

## Vite 插件

| 主题 | 描述 | 参考 |
|------|------|------|
| vite-plugin-uni-pages | 基于文件的路由系统，支持自动页面发现 | [plugin-pages](references/plugin-pages.md) |
| vite-plugin-uni-layouts | 类似 Nuxt 的布局系统 | [plugin-layouts](references/plugin-layouts.md) |
| vite-plugin-uni-components | 按需自动组件导入 | [plugin-components](references/plugin-components.md) |
| vite-plugin-uni-manifest | 使用 TypeScript 编写 manifest.json | [plugin-manifest](references/plugin-manifest.md) |
| vite-plugin-uni-platform | 基于文件的平台编译 (*.h5|mp-weixin|app.*) | [plugin-platform](references/plugin-platform.md) |
| vite-plugin-uni-platform-modifier | 属性和指令的平台修饰符 | [plugin-platform-modifier](references/plugin-platform-modifier.md) |
| vite-plugin-uni-middleware | uni-app 路由中间件支持 | [plugin-middleware](references/plugin-middleware.md) |

## 库

| 主题 | 描述 | 参考 |
|------|------|------|
| uni-use | 类似 VueUse 的 uni-app 组合式工具 | [lib-uni-use](references/lib-uni-use.md) |
| uni-network | 基于 Promise 的 uni-app HTTP 客户端 | [lib-uni-network](references/lib-uni-network.md) |
| uni-promises | uni-app API 的 Promise 封装 | [lib-uni-promises](references/lib-uni-promises.md) |
| uni-typed | uni-app 模板的 TypeScript 类型定义 | [lib-uni-typed](references/lib-uni-typed.md) |

## 工具

| 主题 | 描述 | 参考 |
|------|------|------|
| uni-env | uni-app 环境检测工具 | [util-uni-env](references/util-uni-env.md) |
| unocss-preset-uni | uni-app 的 UnoCSS 预设 | [util-unocss-preset](references/util-unocss-preset.md) |

## 项目脚手架

| 主题 | 描述 | 参考 |
|------|------|------|
| create-uni | uni-app 项目的 CLI 脚手架工具 | [starter-create-uni](references/starter-create-uni.md) |
| vitesse-uni-app | 基于 Vite 的 uni-app 启动模板 | [starter-vitesse](references/starter-vitesse.md) |

## 插件顺序最佳实践

使用多个 uni-helper Vite 插件时，推荐的顺序是：

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    UniComponents(),  // 1. 组件自动导入
    UniPages(),       // 2. 基于文件的路由
    UniLayouts(),     // 3. 布局系统
    UniManifest(),    // 4. 清单生成
    UniPlatform(),    // 5. 平台特定文件
    UniPlatformModifier(), // 6. 平台修饰符
    UniMiddleware(),  // 7. 路由中间件
    Uni(),            // 8. 官方 uni-app 插件（始终放在最后）
  ],
})
```

## 快速开始

使用 create-uni 创建新的 uni-app 项目：

```bash
# npm 7+ 需要额外的双横线
npm create uni@latest

# pnpm
pnpm create uni

# yarn
yarn create uni
```

## 官方资源

- 网站：https://uni-helper.js.org
- GitHub：https://github.com/uni-helper
- NPM 范围：@uni-helper
