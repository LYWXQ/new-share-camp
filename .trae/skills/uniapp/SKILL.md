---
name: uni-app
description: uni-app 跨平台开发框架综合技能参考。做什么：提供 uni-app 框架的核心概念、组件、API 和配置信息，支持开发跨平台应用。何时调用：开发 iOS、Android、HarmonyOS、Web 或各类小程序平台应用时需要使用 uni-app 框架的核心功能、组件或 API 时。
metadata:
  author: FlippeDround
  version: "2026.1.30"
  source: Generated from https://gitcode.com/dcloud/unidocs-zh, skills located at https://github.com/antfu/skills
---

> 本技能基于 uni-app 文档生成，生成日期：2026-01-30。

uni-app 是一个基于 Vue.js 的跨平台框架，用于开发运行在 iOS、Android、HarmonyOS、Web（响应式）以及各种小程序平台（微信/支付宝/百度/抖音/飞书/QQ/快手/钉钉/淘宝/京东/小红书）上的应用程序。

## 核心

| 主题 | 描述 | 参考 |
|------|------|------|
| 核心框架 | 项目结构、平台支持、条件编译 | [core-framework](references/core-framework.md) |
| 视图组件 | view、scroll-view、swiper、movable-area、cover-view | [core-view-components](references/core-view-components.md) |
| 表单组件 | input、textarea、picker、checkbox、radio、switch、slider | [core-form-components](references/core-form-components.md) |

## 功能特性

### UI 组件

| 主题 | 描述 | 参考 |
|------|------|------|
| 媒体组件 | image、video、camera、live-player、map | [feature-media-components](references/feature-media-components.md) |
| 导航 | navigator、路由、页面导航 | [feature-navigation](references/feature-navigation.md) |
| UI 反馈 | toast、modal、loading、action sheet、下拉刷新 | [feature-ui-feedback](references/feature-ui-feedback.md) |

### API

| 主题 | 描述 | 参考 |
|------|------|------|
| 网络请求 | HTTP 请求、文件上传/下载、WebSocket | [feature-network](references/feature-network.md) |
| 存储 | 本地存储、文件系统、缓存 | [feature-storage](references/feature-storage.md) |
| 系统信息 | 设备信息、网络状态、屏幕、振动 | [feature-system-info](references/feature-system-info.md) |
| 文件操作 | 图片/视频选择、文件系统操作 | [feature-file-operations](references/feature-file-operations.md) |
| 位置服务 | 地理定位、地图组件、地址选择 | [feature-location](references/feature-location.md) |
| 生命周期 | 应用和页面生命周期钩子 | [feature-lifecycle](references/feature-lifecycle.md) |

## 配置

| 主题 | 描述 | 参考 |
|------|------|------|
| pages.json | 页面路由、tabBar、全局样式、分包 | [config-pages](references/config-pages.md) |
| manifest.json | 应用配置、权限、平台设置 | [config-manifest](references/config-manifest.md) |

## 平台支持

| 平台 | 支持级别 |
|------|----------|
| iOS App | 完全支持 |
| Android App | 完全支持 |
| HarmonyOS Next | 完全支持 |
| H5/Web | 完全支持 |
| 微信小程序 | 完全支持 |
| 支付宝小程序 | 完全支持 |
| 百度智能小程序 | 完全支持 |
| 抖音小程序 | 完全支持 |
| QQ 小程序 | 完全支持 |
| 快手小程序 | 完全支持 |
| 飞书小程序 | 完全支持 |
| 京东小程序 | 完全支持 |
| HarmonyOS 元服务 | 完全支持 |

## 核心概念

### 条件编译

使用特殊注释编写平台特定代码：

```vue
<!-- #ifdef APP-PLUS -->
<view>仅 App 可用</view>
<!-- #endif -->

<!-- #ifdef MP-WEIXIN -->
<view>仅微信小程序可用</view>
<!-- #endif -->
```

### API Promise 支持

大多数 uni-app API 在不提供回调时支持 Promise：

```javascript
const res = await uni.request({ url: 'https://api.example.com' })
```

### 跨平台最佳实践

1. 使用 uni-app 组件和 API 替代平台特定组件
2. 使用条件编译处理平台特定功能
3. 在所有目标平台上进行测试
4. 使用 rpx 进行响应式布局
5. 在 manifest.json 中处理平台差异
6. 必须使用 uni-helper 工具

### MCP 扩展

当需要查询 uni-app 官方文档时，优先调用 `search-docs-by-Uniapp-official` MCP 工具搜索相关 API 文档和使用示例。

**使用场景：**
- 用户询问特定 API 的详细用法
- 需要官方文档中的代码示例
- 查询组件的属性和事件
- 了解 API 的平台兼容性

**工具安装：**
如果检测到该 MCP 工具不可用，引导用户访问 https://github.com/uni-helper/mcp 进行安装。
