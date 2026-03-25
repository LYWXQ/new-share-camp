---
name: 核心框架
description: UniApp 核心框架概念、项目结构和平台概览。在了解 uni-app 项目结构、平台支持、条件编译和跨平台开发最佳实践时调用此技能。
---

# UniApp 核心框架

UniApp 是一个基于 Vue.js 的跨平台框架，用于开发运行在 iOS、Android、HarmonyOS、Web 和各种小程序平台（微信、支付宝、百度、抖音等）上的应用程序。

## 项目结构

```
project-root/
├── pages/                  # 页面文件
│   └── index/
│       └── index.vue       # 页面组件
├── components/             # 可复用组件
├── static/                 # 静态资源（图片、字体）
├── App.vue                 # 应用根组件
├── main.js                 # 应用入口
├── manifest.json           # 应用配置
├── pages.json              # 页面路由配置
└── uni.scss                # 全局 SCSS 变量
```

## 平台支持

| 平台 | 值 | 描述 |
|------|-----|------|
| App | APP-PLUS | iOS/Android 原生应用 |
| App nvue | APP-PLUS-NVUE | 原生渲染页面 |
| H5 | H5 / WEB | Web 应用 |
| 微信小程序 | MP-WEIXIN | 微信小程序 |
| 支付宝 | MP-ALIPAY | 支付宝小程序 |
| 百度 | MP-BAIDU | 百度智能小程序 |
| 抖音 | MP-TOUTIAO | 字节跳动小程序 |
| QQ | MP-QQ | QQ 小程序 |
| 快手 | MP-KUAISHOU | 快手小程序 |
| HarmonyOS | APP-HARMONY | HarmonyOS Next |

## 条件编译

使用特殊注释语法处理平台差异：

```vue
<template>
  <view>
    <!-- #ifdef APP-PLUS -->
    <text>仅 App 内容</text>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <text>仅微信小程序</text>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <text>除 H5 外的所有平台</text>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  methods: {
    getPlatform() {
      // #ifdef APP-PLUS
      return 'App'
      // #endif
      // #ifdef H5
      return 'Web'
      // #endif
    }
  }
}
</script>

<style>
/* #ifdef APP-PLUS */
.app-style { padding: 20px; }
/* #endif */
</style>
```

## 平台值参考

| 值 | 描述 |
|-----|------|
| VUE3 / VUE2 | Vue 版本 |
| UNI-APP-X | UniApp X 项目 |
| APP-PLUS | App（JS 引擎） |
| APP-PLUS-NVUE / APP-NVUE | App nvue 页面 |
| APP-ANDROID | Android 平台 |
| APP-IOS | iOS 平台 |
| APP-HARMONY | HarmonyOS Next |
| H5 / WEB | Web 平台 |
| MP-WEIXIN | 微信小程序 |
| MP-ALIPAY | 支付宝小程序 |
| MP-BAIDU | 百度智能小程序 |
| MP-TOUTIAO | 抖音小程序 |
| MP-LARK | 飞书小程序 |
| MP-QQ | QQ 小程序 |
| MP-KUAISHOU | 快手小程序 |
| MP-HARMONY | HarmonyOS 元服务 |

## API Promise 支持

UniApp API 在不提供回调时支持 Promise：

```javascript
// Promise 风格
uni.request({ url: 'https://api.example.com' })
  .then(res => console.log(res))
  .catch(err => console.error(err))

// Async/await
async function fetchData() {
  try {
    const res = await uni.request({ url: 'https://api.example.com' })
    return res.data
  } catch (err) {
    console.error(err)
  }
}
```

**注意：** 同步 API（以 `Sync` 结尾）、`create*` 方法和 `*Manager` 方法不支持 Promise。

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/README.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/tutorial/platform.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/README.md
-->
