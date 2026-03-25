---
name: unocss-preset-uni
description: uni-app 的 UnoCSS 预设 - 包含平台特定工具和 rpx 支持，做什么：专为 uni-app 开发设计的 UnoCSS 预设，提供 rpx 单位和平台特定样式工具；何时调用：当用户需要配置 UnoCSS 用于 uni-app、使用 rpx 单位工具或应用平台特定样式时调用
---

# unocss-preset-uni

专为 uni-app 开发设计的 UnoCSS 预设。提供 rpx 单位和平台特定样式工具。

## 安装

```bash
npm i -D @uni-helper/unocss-preset-uni
```

## 设置

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni(),
  ],
})
```

## 特性

- **rpx 支持**：自动转换为 rpx 单位
- **平台变体**：针对特定平台的样式
- **安全区域工具**：处理刘海屏和安全区域
- **兼容**：小程序、H5 和 App

## RPX 工具

预设自动将像素值转换为 rpx：

```html
<!-- 这些生成 rpx 单位 -->
<view class="w-100"></view>    <!-- width: 100rpx -->
<view class="h-50"></view>     <!-- height: 50rpx -->
<view class="m-20"></view>     <!-- margin: 20rpx -->
<view class="p-16"></view>     <!-- padding: 16rpx -->
<view class="text-32"></view>  <!-- font-size: 32rpx -->
```

## 平台变体

将样式应用到特定平台：

```html
<!-- 仅在 H5 上应用 -->
<view class="h5:bg-red"></view>

<!-- 仅在微信上应用 -->
<view class="mp-weixin:bg-blue"></view>

<!-- 仅在 App 上应用 -->
<view class="app:bg-green"></view>

<!-- 与响应式结合 -->
<view class="h5:p-20 mp-weixin:p-10"></view>
```

## 安全区域工具

```html
<!-- 安全区域内边距 -->
<view class="pt-safe"></view>      <!-- padding-top: env(safe-area-inset-top) -->
<view class="pb-safe"></view>      <!-- padding-bottom: env(safe-area-inset-bottom) -->
<view class="px-safe"></view>      <!-- 带安全区域的 padding-x -->

<!-- 安全区域外边距 -->
<view class="mt-safe"></view>
<view class="mb-safe"></view>

<!-- 完整安全区域 -->
<view class="safe-area"></view>
```

## Tab Bar 工具

```html
<!-- Tab Bar 内边距 -->
<view class="pb-tabbar"></view>

<!-- Tab Bar 外边距 -->
<view class="mb-tabbar"></view>
```

## 状态栏工具

```html
<!-- 状态栏高度 -->
<view class="h-statusbar"></view>
<view class="pt-statusbar"></view>
```

## 配置

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni({
      // rpx 基准宽度（默认：750）
      baseWidth: 750,

      // 启用平台变体
      platform: true,

      // 启用安全区域工具
      safeArea: true,

      // 自定义平台
      platforms: ['mp-weixin', 'mp-alipay', 'h5', 'app'],
    }),
  ],
})
```

## 与 Vite 一起使用

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
    Uni(),
  ],
})
```

## 示例

```vue
<template>
  <view class="page bg-gray-100">
    <!-- 状态栏间距 -->
    <view class="h-statusbar"></view>

    <!-- 带安全区域的头部 -->
    <view class="px-32 pt-safe flex items-center justify-between">
      <text class="text-36 font-bold">标题</text>
    </view>

    <!-- 内容 -->
    <view class="p-32 flex flex-col gap-20">
      <!-- 平台特定样式 -->
      <view class="card h5:shadow-lg mp-weixin:border">
        <text class="text-28 text-gray-800">内容</text>
      </view>
    </view>

    <!-- 刘海屏设备的底部安全区域 -->
    <view class="pb-safe"></view>
  </view>
</template>
```

<!--
Source references:
- https://github.com/uni-helper/unocss-preset-uni
- https://uni-helper.js.org/unocss-preset-uni
-->
