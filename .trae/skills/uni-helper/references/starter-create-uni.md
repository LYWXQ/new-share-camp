---
name: create-uni
description: 创建 uni-app 项目的 CLI 脚手架工具 - 包含最佳实践，做什么：用于搭建 uni-app 项目的交互式 CLI 工具，支持选择模板、插件和 UI 库；何时调用：当用户需要创建新的 uni-app 项目、选择项目模板或添加插件和 UI 库时调用
---

# create-uni

用于搭建 uni-app 项目的交互式 CLI 工具。快速创建包含所选模板、插件和 UI 库的项目。

## 用法

```bash
# 创建新项目
npm create uni@latest

# 带项目名称
npm create uni@latest my-project

# 带选项
npm create uni@latest my-project --ts --template vitesse -m pinia -u wot
```

## CLI 选项

| 选项 | 简写 | 描述 |
|--------|-----------|-------------|
| `--template` | `-t` | 选择项目模板 |
| `--typescript` | `--ts` | 启用 TypeScript |
| `--eslint` | `-e` | 添加 ESLint |
| `--plugin` | `-p` | 添加 Vite 插件 |
| `--module` | `-m` | 添加功能模块 |
| `--ui` | `-u` | 添加 UI 组件库 |
| `--gui` | - | 启动 GUI 界面 |
| `--info` | - | 显示项目信息 |

## 模板

| 模板 | 描述 | 值 |
|----------|-------------|-------|
| Vitesse Uni App | 基于 Vite + uni-app 的最佳实践启动模板 | `vitesse` |
| Wot Starter | 基于 vitesse 和 wot-ui | `wot-starter` |
| Wot Starter Retail | 零售/电商模板 | `wot-starter-retail` |
| Unisave | 以 Web 为主的 uni-app 开发 | `unisave` |
| TMUI 3.2 | 企业级组件库 | `tmui32` |
| uView Pro Starter | uView Pro 快速开始 | `uview-pro-starter` |
| uView Pro Demo | uView Pro 完整演示 | `uview-pro-demo` |

## 可用插件

| 插件 | CLI 值 | 描述 |
|--------|-----------|-------------|
| vite-plugin-uni-components | `import` | 自动组件导入 |
| vite-plugin-uni-pages | `pages` | 基于文件的路由 |
| vite-plugin-uni-layouts | `layouts` | 类似 Nuxt 的布局 |
| vite-plugin-uni-manifest | `manifest` | TypeScript 清单 |
| vite-plugin-uni-platform | `filePlatform` | 平台特定文件 |
| vite-plugin-uni-platform-modifier | `platformModifier` | 平台修饰符 |
| vite-plugin-uni-middleware | `middleware` | 路由中间件 |
| uni-ku-root | `root` | 虚拟根组件 |

## 可用模块

| 模块 | CLI 值 | 描述 |
|--------|-----------|-------------|
| Pinia | `pinia` | 状态管理 |
| UnoCSS | `unocss` | 原子 CSS |
| uni-network | `uniNetwork` | HTTP 客户端 |
| uni-use | `uniUse` | 组合式工具 |
| uni-promises | `uniPromises` | Promise 封装 |
| Uni ECharts | `uniEcharts` | 图表组件 |
| z-paging | `zPaging` | 分页组件 |

## UI 库

| UI 库 | CLI 值 | 描述 |
|------------|-----------|-------------|
| Uni UI | `uni` | DCloud 官方 UI |
| Wot Design Uni | `wot` | 轻量美观 |
| uView Pro | `uview-pro` | Vue 3 + TypeScript |
| NutUI Uniapp | `nut` | 京东风格，电商 |
| Skiyee UI | `skiyee` | 独特设计语言 |
| UV UI | `uv` | 多平台 |
| Ano UI | `ano` | 基于 UnoCSS |

## 示例

### 基础 TypeScript 项目

```bash
npm create uni@latest my-app --ts
```

### 使用 Vitesse 模板

```bash
npm create uni@latest my-app --ts --template vitesse
```

### 完整功能设置

```bash
npm create uni@latest my-app \
  --ts \
  --template vitesse \
  -p pages -p layouts -p import \
  -m pinia -m unocss -m uniUse \
  -u wot \
  -e
```

### GUI 模式

```bash
npm create uni@latest --gui
```

## 项目结构

创建的项目遵循此结构：

```
my-project/
├── src/
│   ├── components/      # Vue 组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件（如果使用 layouts 插件）
│   ├── pages/           # 页面组件
│   ├── static/          # 静态资源
│   ├── stores/          # Pinia stores（如果使用 pinia）
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.config.ts  #（如果使用 manifest 插件）
│   └── pages.config.ts     #（如果使用 pages 插件）
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── uno.config.ts       #（如果使用 unocss）
```

## 创建后

```bash
cd my-project
npm install
npm run dev
```

<!--
Source references:
- https://github.com/uni-helper/create-uni
- https://uni-helper.js.org/create-uni
-->
