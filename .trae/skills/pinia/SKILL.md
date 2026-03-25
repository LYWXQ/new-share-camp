---
name: pinia
description: Pinia 官方 Vue 状态管理库，类型安全且可扩展。做什么：定义 store、管理全局状态、处理 state/getters/actions。何时调用：需要在 Vue 应用中实现状态管理、创建全局 store、管理跨组件共享数据时。
metadata:
  author: Anthony Fu
  version: "2026.1.28"
  source: Generated from https://github.com/vuejs/pinia, scripts located at https://github.com/antfu/skills
---

# Pinia

Pinia 是 Vue 的官方状态管理库，设计直观且类型安全。它同时支持 Options API 和 Composition API 风格，具备一流的 TypeScript 支持和开发工具集成。

> 本技能基于 Pinia v3.0.4，生成于 2026-01-28。

## 核心参考

| 主题 | 描述 | 参考 |
|------|-------------|-----------|
| Stores | 定义 store、state、getters、actions、storeToRefs、订阅 | [core-stores](references/core-stores.md) |

## 特性

### 可扩展性

| 主题 | 描述 | 参考 |
|------|-------------|-----------|
| 插件 | 使用自定义属性、状态和行为扩展 store | [features-plugins](references/features-plugins.md) |

### 可组合性

| 主题 | 描述 | 参考 |
|------|-------------|-----------|
| 组合式函数 | 在 store 中使用 Vue 组合式函数（VueUse 等） | [features-composables](references/features-composables.md) |
| Store 组合 | Store 之间的通信，避免循环依赖 | [features-composing-stores](references/features-composing-stores.md) |

## 最佳实践

| 主题 | 描述 | 参考 |
|------|-------------|-----------|
| 测试 | 使用 @pinia/testing 进行单元测试、模拟和存根 | [best-practices-testing](references/best-practices-testing.md) |
| 组件外部使用 | 在导航守卫、插件、中间件中使用 store | [best-practices-outside-component](references/best-practices-outside-component.md) |

## 高级用法

| 主题 | 描述 | 参考 |
|------|-------------|-----------|
| SSR | 服务端渲染、状态注水 | [advanced-ssr](references/advanced-ssr.md) |
| Nuxt | Nuxt 集成、自动导入、SSR 最佳实践 | [advanced-nuxt](references/advanced-nuxt.md) |
| HMR | 开发环境的热模块替换 | [advanced-hmr](references/advanced-hmr.md) |

## 关键建议

- **优先使用 Setup Stores** 用于复杂逻辑、组合式函数和监听器
- **使用 `storeToRefs()`** 在解构 state/getters 时保持响应性
- **Actions 可以直接解构** - 它们已绑定到 store
- **在函数内部调用 store** 而不是在模块作用域，特别是在 SSR 中
- **为每个 store 添加 HMR 支持** 以获得更好的开发体验
- **使用 `@pinia/testing`** 进行带有模拟 store 的组件测试
