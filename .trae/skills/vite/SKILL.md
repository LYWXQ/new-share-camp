---
name: vite
description: Vite 下一代前端构建工具，支持快速 HMR 和热更新。做什么：配置构建工具、管理开发服务器、添加插件、优化生产构建。何时调用：需要配置 Vite、添加插件、使用开发服务器、构建生产环境或优化构建性能时。
metadata:
  author: Anthony Fu
  version: "2026.1.28"
  source: Generated from https://github.com/vitejs/vite, scripts located at https://github.com/antfu/skills
---

Vite 是一个现代前端构建工具，具有原生 ES 模块的即时服务器启动、闪电般快速的热模块替换（HMR）以及使用 Rolldown/Rollup 的优化生产构建。它开箱即用地支持 TypeScript、JSX、CSS 预处理器，并拥有丰富的插件生态系统。

> 本技能基于 Vite 6.x，生成于 2026-01-28。

## 核心

| 主题 | 描述 | 参考 |
|------|------|------|
| 配置 | 配置文件设置、defineConfig、条件和异步配置 | [core-config](references/core-config.md) |
| CLI 命令 | 开发服务器、构建、预览命令和选项 | [core-cli](references/core-cli.md) |
| 核心功能 | TypeScript、JSX、CSS、HTML 处理、JSON 处理 | [core-features](references/core-features.md) |
| 使用插件 | 添加、配置和排序插件 | [core-plugins](references/core-plugins.md) |

## 功能

| 主题 | 描述 | 参考 |
|------|------|------|
| CSS 处理 | CSS 模块、预处理器、PostCSS、Lightning CSS | [features-css](references/features-css.md) |
| 静态资源 | 资源导入、public 目录、URL 处理 | [features-assets](references/features-assets.md) |
| Glob 导入 | import.meta.glob、动态导入、批量加载 | [features-glob-import](references/features-glob-import.md) |
| 环境变量 | .env 文件、模式、import.meta.env 常量 | [features-env](references/features-env.md) |
| HMR API | 热模块替换客户端 API | [features-hmr](references/features-hmr.md) |
| Web Workers | Worker 导入和配置 | [features-workers](references/features-workers.md) |
| 依赖预打包 | optimizeDeps、缓存、monorepo 设置 | [features-dep-bundling](references/features-dep-bundling.md) |

## 构建

| 主题 | 描述 | 参考 |
|------|------|------|
| 生产构建 | 构建选项、浏览器目标、多页面应用 | [build-production](references/build-production.md) |
| 库模式 | 使用正确的包导出构建库 | [build-library](references/build-library.md) |
| SSR | 服务器端渲染设置和配置 | [build-ssr](references/build-ssr.md) |

## 高级

| 主题 | 描述 | 参考 |
|------|------|------|
| JavaScript API | createServer、build、preview 程序化 API | [advanced-api](references/advanced-api.md) |
| 插件 API | 创建 Vite 插件、钩子、虚拟模块 | [advanced-plugin-api](references/advanced-plugin-api.md) |
| 性能 | 开发服务器和构建的优化技巧 | [advanced-performance](references/advanced-performance.md) |
| 后端集成 | 将 Vite 与传统后端框架集成 | [advanced-backend](references/advanced-backend.md)
