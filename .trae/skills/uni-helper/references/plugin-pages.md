---
name: vite-plugin-uni-pages
description: 基于 Vite 的 uni-app 文件路由系统 - 自动页面发现和 TypeScript 支持，做什么：为 uni-app 项目提供基于文件的路由，从文件结构自动生成 pages.json 配置；何时调用：当用户需要配置基于文件的路由、使用 definePage 宏定义页面配置或访问虚拟模块页面元数据时调用
---

# vite-plugin-uni-pages

为使用 Vite 的 uni-app 项目提供基于文件的路由。从文件结构自动生成 `pages.json` 配置。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-pages
```

## 基本设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import { defineConfig } from 'vite'

// 将 UniPages 放在 Uni 之前
export default defineConfig({
  plugins: [UniPages(), Uni()],
})
```

## TypeScript 支持

将类型添加到 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "types": ["@uni-helper/vite-plugin-uni-pages"]
  }
}
```

## 全局配置

创建 `pages.config.ts`（或 .js/.json）用于全局设置：

```ts
// pages.config.ts
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  // 可选：手动页面具有最高优先级
  pages: [],
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '@uni-helper',
  },
})
```

## 虚拟模块

通过虚拟模块访问页面元数据：

```ts
/// <reference types="@uni-helper/vite-plugin-uni-pages/client" />
import { pages } from 'virtual:uni-pages'

console.log(pages)
```

## definePage 宏

直接在 SFC 文件中定义页面配置：

```vue
<script setup lang="ts">
// 对象形式
definePage({
  style: {
    navigationBarTitleText: 'hello world',
  },
  middlewares: ['auth'],
})

// 函数形式（支持 TypeScript、异步）
definePage(() => {
  return {
    style: {
      navigationBarTitleText: '动态标题',
    },
  }
})

// 异步形式
definePage(async () => {
  const title = await fetchTitle()
  return {
    style: { navigationBarTitleText: title },
  }
})
</script>
```

### definePage 重要说明

- 写在 `<script>` 块内
- `definePage` 在与 SFC 不同的作用域中运行（无法访问 SFC 变量）
- 页面路径从文件路径自动生成
- 每个文件只能有一个 `definePage`
- 支持导入外部库（仅限纯 JS）
- 支持 TypeScript 类型导入（类型会被剥离）

### 与条件编译一起使用

```vue
<script setup>
import { isH5 } from '@uni-helper/uni-env'

definePage(() => {
  const title = isH5 ? 'H5 环境' : '其他平台'
  return {
    style: { navigationBarTitleText: title },
  }
})
</script>
```

## 配置选项

```ts
export interface Options {
  /** 生成 TypeScript 声明 */
  dts?: boolean | string  // 默认：true（输出 uni-pages.d.ts）

  /** 配置文件模式 */
  configSource: string    // 默认：'pages.config.(ts|mts|cts|js|cjs|mjs|json)'

  /** 默认首页 */
  homePage: string        // 默认：'pages/index' 或 'pages/index/index'

  /** 与现有 pages.json 合并 */
  mergePages: boolean     // 默认：true

  /** 页面目录 */
  dir: string             // 默认：'src/pages'

  /** 分包目录 */
  subPackages: string[]   // 例如：['src/pages-sub']

  /** pages.json 输出目录 */
  outDir: string          // 默认：'src'

  /** 排除模式 */
  exclude: string[]       // 默认：[]

  /** SFC 中的路由块语言 */
  routeBlockLang: 'json5' | 'jsonc' | 'json' | 'yaml' | 'yml'  // 默认：'json5'

  // 生命周期钩子
  onBeforeLoadUserConfig?: (ctx: PageContext) => void
  onAfterLoadUserConfig?: (ctx: PageContext) => void
  onBeforeScanPages?: (ctx: PageContext) => void
  onAfterScanPages?: (ctx: PageContext) => void
  onBeforeMergePageMetaData?: (ctx: PageContext) => void
  onAfterMergePageMetaData?: (ctx: PageContext) => void
  onBeforeWriteFile?: (ctx: PageContext) => void
  onAfterWriteFile?: (ctx: PageContext) => void
}
```

## 与布局一起使用

```vue
<script setup>
definePage({
  layout: 'default',  // 指定布局
  middlewares: ['auth'],
})
</script>
```

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-pages
- https://uni-helper.js.org/vite-plugin-uni-pages
-->
