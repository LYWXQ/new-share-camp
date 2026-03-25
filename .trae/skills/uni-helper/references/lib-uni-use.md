---
name: uni-use
description: 类似 VueUse 的 uni-app 组合式工具 - 专为 uni-app 设计的响应式工具函数，做什么：提供围绕 uni-app API 的响应式封装，包括生命周期钩子、系统信息、存储、UI 等组合式函数；何时调用：当用户需要使用组合式 API 访问 uni-app 功能（如系统信息、存储、剪贴板、位置等）时调用
---

# uni-use

专为 uni-app 设计的类似 VueUse 的组合式工具。提供围绕 uni-app API 的响应式封装。

## 安装

```bash
npm i @uni-helper/uni-use @vueuse/core@9
```

## 用法

```ts
import { tryOnLoad, useClipboard, useSystemInfo } from '@uni-helper/uni-use'

tryOnLoad(() => {
  console.log('页面加载')
})

const { copy, text } = useClipboard()
const { systemInfo } = useSystemInfo()
```

## 自动导入设置

```ts
// vite.config.ts
import { uniuseAutoImports } from '@uni-helper/uni-use'
import autoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    autoImport({
      imports: [uniuseAutoImports()],
    }),
    uni(),
  ],
})
```

## 可用组合式函数

### 生命周期

| 组合式函数 | 描述 |
|------------|------|
| `tryOnLoad` | 带 try-catch 的 onLoad |
| `tryOnShow` | 带 try-catch 的 onShow |
| `tryOnHide` | 带 try-catch 的 onHide |
| `tryOnReady` | 带 try-catch 的 onReady |
| `tryOnUnload` | 带 try-catch 的 onUnload |
| `tryOnPullDownRefresh` | 带 try-catch 的 onPullDownRefresh |
| `tryOnReachBottom` | 带 try-catch 的 onReachBottom |
| `tryOnPageScroll` | 带 try-catch 的 onPageScroll |
| `tryOnTabItemTap` | 带 try-catch 的 onTabItemTap |

### 系统

| 组合式函数 | 描述 |
|------------|------|
| `useSystemInfo` | 响应式系统信息 |
| `useDeviceInfo` | 设备信息 |
| `useWindowInfo` | 窗口尺寸 |
| `useAppTheme` | 应用主题（深色/浅色） |
| `useNetworkStatus` | 网络连接状态 |
| `useBattery` | 电池状态 |

### 存储

| 组合式函数 | 描述 |
|------------|------|
| `useStorage` | 响应式本地存储 |
| `useStorageAsync` | 异步存储操作 |

### UI

| 组合式函数 | 描述 |
|------------|------|
| `useClipboard` | 剪贴板操作 |
| `useToast` | 提示通知 |
| `useModal` | 模态框 |
| `useActionSheet` | 操作菜单 |
| `useLoading` | 加载指示器 |
| `useNavigationBar` | 导航栏控制 |
| `usePullDownRefresh` | 下拉刷新 |

### 位置

| 组合式函数 | 描述 |
|------------|------|
| `useLocation` | 当前位置 |
| `useChooseLocation` | 位置选择器 |

### 媒体

| 组合式函数 | 描述 |
|------------|------|
| `useImage` | 图片操作 |
| `useCamera` | 相机访问 |
| `useRecorder` | 录音 |

## 示例用法

```vue
<script setup lang="ts">
import { useClipboard, useSystemInfo, useStorage, tryOnLoad } from '@uni-helper/uni-use'

// 系统信息
const { systemInfo, safeArea } = useSystemInfo()

// 剪贴板
const { text, copy, isSupported } = useClipboard()
const handleCopy = async () => {
  await copy('Hello uni-app')
  uni.showToast({ title: '已复制!' })
}

// 存储
const userToken = useStorage('token', '')
const saveToken = (token: string) => {
  userToken.value = token
}

// 生命周期
tryOnLoad((options) => {
  console.log('页面选项:', options)
})
</script>

<template>
  <view class="page">
    <text>平台: {{ systemInfo.platform }}</text>
    <text>安全区域顶部: {{ safeArea?.top }}px</text>
    <button @click="handleCopy">复制到剪贴板</button>
  </view>
</template>
```

## 构建配置

对于面向 ES6 的 Vite + Vue3 项目：

```ts
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es6',
    cssTarget: 'chrome61',
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})
```

如有需要在 `main.ts` 中添加 polyfills：

```ts
// main.ts
import 'core-js/actual/array/iterator'
import 'core-js/actual/promise'
import 'core-js/actual/object/assign'
```

## 限制

- 小程序和 App 环境缺少一些全局对象（window、navigator）
- 不能使用顶层 await
- 某些 VueUse 功能可能在 uni-app 中无法使用

## 另请参阅

- 完整 API 文档：https://uni-helper.js.org/uni-use/apis
- VueUse：https://vueuse.org/

<!--
Source references:
- https://github.com/uni-helper/uni-use
- https://uni-helper.js.org/uni-use
-->
