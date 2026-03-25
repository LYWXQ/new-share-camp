---
name: vite-plugin-uni-layouts
description: 类似 Nuxt 的 uni-app 布局系统 - 使用可复用布局组件包裹页面，做什么：提供类似 Nuxt 的布局系统，支持通过 definePage 配置布局、动态布局切换和布局引用访问；何时调用：当用户需要创建布局、在页面中应用布局或实现动态布局切换时调用
---

# vite-plugin-uni-layouts

为 uni-app 提供类似 Nuxt 的布局系统。使用可复用的布局组件包裹页面。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-layouts
```

## 设置

```ts
// vite.config.ts
import uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UniLayouts(), uni()],
})
```

## 创建布局

在 `src/layouts/` 目录中创建布局文件：

```vue
<!-- src/layouts/default.vue -->
<template>
  <view class="layout">
    <slot name="header" />
    <slot>主要内容</slot>
    <slot name="footer" />
  </view>
</template>
```

## 应用布局

### 通过 pages.json（传统方式）

```json
{
  "pages": [{
    "path": "pages/index/index",
    "layout": "default"
  },
  {
    "path": "pages/about/index",
    "layout": false  // 禁用布局
  }]
}
```

### 通过 definePage（推荐）

```vue
<script setup>
definePage({
  layout: 'default',
})
</script>
```

## 动态布局

使用 `<uni-layout>` 组件进行动态布局切换：

```vue
<script setup>
const layoutName = ref('default')
</script>

<template>
  <!-- 先禁用页面布局 -->
  <uni-layout :name="layoutName">
    <template #header>
      <text>头部内容</text>
    </template>

    主要内容在这里

    <template #footer>
      <text>底部内容</text>
    </template>
  </uni-layout>
</template>
```

### 访问布局引用

```vue
<script setup>
const uniLayout = ref()

onMounted(() => {
  console.log(uniLayout.value)  // 访问布局组件
})
</script>

<template>
  <uni-layout ref="uniLayout">
    内容
  </uni-layout>
</template>
```

Options API：

```vue
<script>
export default {
  onLoad() {
    console.log(this.$refs.uniLayout)
  },
}
</script>
```

## 工作原理

插件做两件事：

1. 自动扫描并全局注册 `layouts/` 目录中的组件
2. 使用指定的布局组件包裹页面

> **注意：** 微信小程序限制 - 如果使用 `web-view` 组件，布局包裹可能无法正常工作。

## 配置

请参阅 [类型定义](https://github.com/uni-helper/vite-plugin-uni-layouts/blob/main/src/types.ts) 了解所有选项。

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-layouts
- https://uni-helper.js.org/vite-plugin-uni-layouts
-->
