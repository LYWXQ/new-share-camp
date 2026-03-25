---
name: vite-plugin-uni-manifest
description: 使用 TypeScript 编写 uni-app manifest.json - 具有类型安全和智能提示，做什么：允许使用 TypeScript 编写 manifest.json 配置，提供完整的类型安全和 IntelliSense 支持；何时调用：当用户需要使用 TypeScript 配置 manifest.json、需要类型安全的环境配置或动态生成应用配置时调用
---

# vite-plugin-uni-manifest

使用 TypeScript 编写 uni-app `manifest.json` 配置，具有完整的类型安全和智能提示支持。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-manifest
```

## 设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UniManifest(), Uni()],
})
```

## 配置文件

创建 `manifest.config.ts`（或 .js/.json）：

```ts
// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({
  name: 'my-uni-app',
  appid: '__UNI__XXXXXXX',
  description: '我的 uni-app 项目',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  app: {
    // App 特定配置
  },
  mp-weixin: {
    // 微信小程序配置
  },
  mp-alipay: {
    // 支付宝小程序配置
  },
  h5: {
    // H5 配置
  },
})
```

## 优势

- **类型安全**：所有 manifest 属性的完整 TypeScript 智能提示
- **代码复用**：导入并复用配置值
- **注释**：添加注释说明配置选择
- **基于环境的配置**：对不同环境使用条件判断

## 动态配置示例

```ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { version } from './package.json'

export default defineManifestConfig({
  name: 'My App',
  versionName: version,
  versionCode: version.replace(/\./g, ''),

  // 平台特定配置
  'mp-weixin': {
    appid: process.env.WX_APPID || '',
    setting: {
      es6: true,
      enhance: true,
    },
  },

  h5: {
    title: 'My H5 App',
    router: {
      mode: 'hash',
    },
  },
})
```

## 配置选项

请参阅 [types.ts](https://github.com/uni-helper/vite-plugin-uni-manifest/tree/main/packages/core/src/types.ts) 了解所有可用选项。

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-manifest
- https://uni-helper.js.org/vite-plugin-uni-manifest
-->
