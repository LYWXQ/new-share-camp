---
name: uni-env
description: uni-app 环境检测工具 - 在运行时检测平台，做什么：在运行时以类型安全的方式检测当前平台，支持 H5、小程序、App 等平台检测；何时调用：当用户需要在运行时检测当前平台、根据平台执行不同逻辑或在 definePage 中使用平台检测时调用
---

# uni-env

uni-app 的运行时环境检测工具。以类型安全的方式检测当前平台。

## 安装

```bash
npm i @uni-helper/uni-env
```

## 用法

```ts
import { isH5, isMpWeixin, isApp, isMp } from '@uni-helper/uni-env'

if (isH5) {
  console.log('运行在 H5')
}

if (isMpWeixin) {
  console.log('运行在微信小程序')
}
```

## 可用检测器

### 平台组

| 检测器 | 描述 |
|----------|-------------|
| `isH5` | H5/Web 平台 |
| `isApp` | iOS/Android App |
| `isMp` | 任何小程序 |
| `isQuickapp` | 快应用 |

### 小程序检测器

| 检测器 | 描述 |
|----------|-------------|
| `isMpWeixin` | 微信小程序 |
| `isMpAlipay` | 支付宝小程序 |
| `isMpBaidu` | 百度智能小程序 |
| `isMpToutiao` | 抖音小程序 |
| `isMpQQ` | QQ 小程序 |
| `isMpKuaishou` | 快手小程序 |
| `isMpJd` | 京东小程序 |
| `isMpHarmony` | 鸿蒙元服务 |
| `isMpLark` | 飞书小程序 |

### 开发环境检测器

| 检测器 | 描述 |
|----------|-------------|
| `isDev` | 开发环境 |
| `isProd` | 生产环境 |

## 使用场景

### 条件逻辑

```ts
import { isH5, isMpWeixin, isApp } from '@uni-helper/uni-env'

function getStorageAdapter() {
  if (isH5) {
    return new LocalStorageAdapter()
  }
  if (isMpWeixin) {
    return new WechatStorageAdapter()
  }
  if (isApp) {
    return new NativeStorageAdapter()
  }
  return new UniStorageAdapter()
}
```

### 平台特定功能

```ts
import { isH5, isMpWeixin } from '@uni-helper/uni-env'

function share(content: ShareContent) {
  if (isMpWeixin) {
    // 使用微信分享 API
    wx.showShareMenu({ withShareTicket: true })
  } else if (isH5) {
    // 使用 Web Share API
    navigator.share({
      title: content.title,
      url: content.url,
    })
  } else {
    // 使用 uni-app 通用分享
    uni.share({
      title: content.title,
      path: content.path,
    })
  }
}
```

### 与 definePage 一起使用

```ts
import { isH5 } from '@uni-helper/uni-env'

definePage(() => {
  const title = isH5 ? 'H5 版本' : '移动版本'

  return {
    style: {
      navigationBarTitleText: title,
    },
  }
})
```

## 重要说明

此包主要用于**插件开发者**。对于运行时条件编译，使用 uni-app 的[官方条件编译](https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor)和 `/* #ifdef */` 注释。

如需更好的条件编译支持，请考虑使用 [unplugin-preprocessor-directives](https://github.com/KeJunMao/unplugin-preprocessor-directives)。

## 与条件编译的比较

```ts
// 运行时检测（uni-env）
import { isH5 } from '@uni-helper/uni-env'
if (isH5) {
  // 此代码存在于所有构建中
  doH5Thing()
}

// 构建时条件编译
// #ifdef H5
doH5Thing()
// #endif
// 此代码仅存在于 H5 构建中
```

根据需求选择：
- 需要相同包支持多平台时使用 **uni-env** 进行运行时检测
- 需要构建时优化和更小包大小时使用 **条件编译**

<!--
Source references:
- https://github.com/uni-helper/uni-env
- https://uni-helper.js.org/uni-env
-->
