---
name: vue
description: Vue.js 渐进式 JavaScript 框架。在构建 Vue 组件、使用响应式系统（ref、reactive、computed、watch）或实现 Vue Composition API 模式时调用。做什么：构建用户界面组件、管理响应式状态、处理组件间通信。何时调用：需要创建 Vue 单文件组件、使用组合式 API、实现组件逻辑复用、处理异步数据获取时。
metadata:
  author: Anthony Fu
  version: "2026.1.28"
  source: Generated from https://github.com/vuejs/docs, scripts located at https://github.com/antfu/skills
---

# Vue

> 本技能基于 Vue 3.5+，生成于 2026-01-28。

Vue 是一个用于构建用户界面的渐进式 JavaScript 框架。它基于标准的 HTML、CSS 和 JavaScript，提供直观的 API 和世界一流的技术文档。使用 `<script setup>` 和 TypeScript 的 Composition API 是构建 Vue 应用的推荐方式。

## 核心参考

| 主题 | 描述 | 参考 |
|------|------|------|
| 响应式系统 | ref、reactive、computed、watch 和 watchEffect | [core-reactivity](references/core-reactivity.md) |

## 组件

| 主题 | 描述 | 参考 |
|------|------|------|
| Props | 使用 TypeScript 声明和验证组件 props | [components-props](references/components-props.md) |
| 事件 (Emits) | 从组件触发自定义事件 | [components-emits](references/components-emits.md) |
| 插槽 | 向子组件传递模板内容 | [components-slots](references/components-slots.md) |
| v-model | 在自定义组件上实现双向绑定 | [components-v-model](references/components-v-model.md) |
| 生命周期钩子 | 在特定组件生命周期阶段运行代码 | [components-lifecycle](references/components-lifecycle.md) |

## 特性

### Script Setup & TypeScript

| 主题 | 描述 | 参考 |
|------|------|------|
| Script Setup | 单文件组件的 Composition API 语法糖 | [features-script-setup](references/features-script-setup.md) |
| TypeScript | 使用 Composition API 编写类型安全的 Vue 组件 | [features-typescript](references/features-typescript.md) |

### 可复用性

| 主题 | 描述 | 参考 |
|------|------|------|
| Composables | 封装和复用有状态的逻辑 | [features-composables](references/features-composables.md) |
| 自定义指令 | 底层 DOM 操作指令 | [features-directives](references/features-directives.md) |
| 模板引用 | 直接访问 DOM 和组件实例 | [features-template-refs](references/features-template-refs.md) |

## 高级特性

| 主题 | 描述 | 参考 |
|------|------|------|
| Provide/Inject | 跨组件树的依赖注入 | [advanced-provide-inject](references/advanced-provide-inject.md) |
| 异步与 Suspense | 顶层 await 注意事项、异步组件、Suspense | [advanced-async-suspense](references/advanced-async-suspense.md) |

## 关键建议

- **所有组件使用 `<script setup lang="ts">`**
- **声明状态时优先使用 `ref()` 而非 `reactive()`**
- **使用基于类型的 props 声明** 配合接口
- **使用 `defineModel()`** 实现 v-model（3.4+）
- **响应式解构 props**（3.5+）以获得更简洁的代码
- **提取 composables** 用于复用有状态的逻辑
