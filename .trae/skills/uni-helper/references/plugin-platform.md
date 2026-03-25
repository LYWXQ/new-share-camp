---
name: vite-plugin-uni-platform
description: uni-app 基于文件的平台编译 - 根据目标平台编译不同文件，做什么：使用文件命名约定根据目标平台编译不同文件，支持平台特定实现而无需条件编译；何时调用：当用户需要为不同平台编写特定实现、使用平台后缀文件或替代 #ifdef 条件编译时调用
---

# vite-plugin-uni-platform

使用文件命名约定根据目标平台编译不同文件。支持平台特定实现而无需条件编译。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-platform
```

## 设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UniPlatform(), Uni()],
})
```

## 文件命名约定

在文件名中使用平台后缀：

```
src/
  utils/
    request.ts           # 默认实现
    request.h5.ts        # H5 特定
    request.mp-weixin.ts # 微信小程序
    request.app.ts       # App (iOS/Android)
```

## 支持的平台

| 后缀 | 平台 |
|--------|----------|
| `.h5.ts` | H5/Web |
| `.mp-weixin.ts` | 微信小程序 |
| `.mp-alipay.ts` | 支付宝小程序 |
| `.mp-baidu.ts` | 百度智能小程序 |
| `.mp-toutiao.ts` | 抖音小程序 |
| `.mp-qq.ts` | QQ 小程序 |
| `.mp-kuaishou.ts` | 快手小程序 |
| `.app.ts` | iOS/Android App |
| `.app-plus.ts` | App（替代） |
| `.harmony` | 鸿蒙 |

## 导入用法

导入时不带平台后缀：

```ts
// 自动解析为正确的平台版本
import { request } from './utils/request'
```

## 示例

```ts
// utils/request.ts - 默认实现
export const request = (options: RequestOptions) => {
  return uni.request(options)
}

// utils/request.h5.ts - H5 使用 axios
import axios from 'axios'

export const request = (options: RequestOptions) => {
  return axios.request(options)
}

// utils/request.mp-weixin.ts - 微信特定
export const request = (options: RequestOptions) => {
  // 添加微信特定的请求头
  return uni.request({
    ...options,
    header: {
      ...options.header,
      'X-Platform': 'weixin',
    },
  })
}
```

## 优势

- 更清晰的代码，无需 `#ifdef` 条件
- 类型安全的平台实现
- Tree-shaking 移除未使用的平台代码
- 更好的 IDE 支持和导航

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-platform
- https://uni-helper.js.org/vite-plugin-uni-platform
-->
