---
name: vite-plugin-uni-platform-modifier
description: uni-app 属性和指令的平台修饰符 - 通过移除未使用平台的代码来优化包大小，做什么：为属性和指令添加平台修饰符，在模板级别进行条件编译，减少其他平台的代码；何时调用：当用户需要为特定平台编写条件模板代码、优化包大小或实现平台特定的 UI 组件时调用
---

# vite-plugin-uni-platform-modifier

为属性和指令添加平台修饰符，用于模板级别的条件编译。通过移除其他平台的代码来减少包大小。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-platform-modifier
```

## 设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UniPlatformModifier(), Uni()],
})
```

## 平台修饰符

### 指令修饰符

```vue
<template>
  <!-- 仅在 H5 上渲染 -->
  <view v-if.h5="condition">H5 专属内容</view>

  <!-- 仅在微信小程序上渲染 -->
  <button v-if.mp-weixin="true">微信专属</button>

  <!-- 仅在 App 上渲染 -->
  <native-view v-if.app="true">原生视图</native-view>

  <!-- 平台特定事件 -->
  <view @click.h5="handleH5Click" @click.mp-weixin="handleWeChatClick">
    平台特定点击
  </view>
</template>
```

### 属性修饰符

```vue
<template>
  <!-- 每个平台不同的类 -->
  <view class.h5="h5-container" class.mp-weixin="wechat-container">
    内容
  </view>

  <!-- 平台特定样式 -->
  <view :style.h5="{ padding: '20px' }" :style.app="{ padding: '10px' }">
    样式内容
  </view>
</template>
```

## 支持的平台

| 修饰符 | 平台 |
|----------|----------|
| `.h5` | H5/Web |
| `.mp-weixin` | 微信小程序 |
| `.mp-alipay` | 支付宝小程序 |
| `.mp-baidu` | 百度智能小程序 |
| `.mp-toutiao` | 抖音小程序 |
| `.mp-qq` | QQ 小程序 |
| `.app` | iOS/Android App |

## 工作原理

插件在构建时转换模板：

```vue
<!-- 源码 -->
<view v-if.h5="show">H5 Only</view>

<!-- H5 构建时转换 -->
<view v-if="show">H5 Only</view>

<!-- 非 H5 构建时移除 -->
```

## 使用场景

- 平台特定的 UI 组件
- 每个平台不同的交互
- 平台优化的样式
- 条件事件处理器

## 与其他插件结合使用

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    UniComponents(),
    UniPages(),
    UniPlatform(),      // 基于文件的平台
    UniPlatformModifier(), // 指令/属性修饰符
    Uni(),
  ],
})
```

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-platform-modifier
- https://uni-helper.js.org/vite-plugin-uni-platform-modifier
-->
