---
name: features-dep-bundling
description: 依赖预打包配置和缓存
---

# 依赖预打包

Vite 在首次运行时预打包依赖项以加快开发服务器启动速度。

## 为什么预打包

1. **CommonJS/UMD 转 ESM** - 转换非 ESM 依赖
2. **性能** - 将许多内部模块打包为单个文件（例如，lodash-es 有 600+ 个模块）

```ts
// 得益于智能导入分析而工作
import React, { useState } from 'react'
```

## 自动发现

Vite 爬取源代码以查找裸导入并使用 Rolldown 预打包它们。

服务器启动后发现的新依赖项会触发重新打包。

## 包含依赖项

强制预打包未自动发现的依赖项：

```ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'some-package',
      'another-package/nested'  // 深层导入
    ]
  }
})
```

**何时包含：**
- 动态导入（通过插件转换）
- 具有许多内部模块的大型依赖项
- CommonJS 依赖项

## 排除依赖项

跳过小型纯 ESM 依赖项的预打包：

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['small-esm-dep']
  }
})
```

## Monorepo 链接依赖

链接的包默认被视为源代码。如果不是 ESM：

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep']
  }
})
```

更改链接依赖后使用 `--force` 重新启动。

## 自定义 Rolldown 选项

```ts
export default defineConfig({
  optimizeDeps: {
    rolldownOptions: {
      plugins: [/* Rolldown 插件 */],
      // 其他 Rolldown 选项
    }
  }
})
```

## 缓存

### 文件系统缓存

位于 `node_modules/.vite`。在以下情况下重新运行：

- 包锁定文件更改（`package-lock.json`、`pnpm-lock.yaml` 等）
- Patches 文件夹修改
- `vite.config.js` 更改
- `NODE_ENV` 更改

强制重新打包：

```bash
vite --force
# 或删除 node_modules/.vite
```

### 浏览器缓存

预打包的依赖项使用 `max-age=31536000,immutable` 缓存。

要使用本地编辑调试依赖项：

1. 在浏览器 DevTools 网络选项卡中禁用缓存
2. 使用 `--force` 重新启动 Vite
3. 重新加载页面

## 入口

指定自定义入口点进行发现：

```ts
export default defineConfig({
  optimizeDeps: {
    entries: [
      'src/main.ts',
      'src/other-entry.ts'
    ]
  }
})
```

默认情况下，所有 HTML 文件都用作入口。

## esbuildOptions（已弃用）

改用 `rolldownOptions`：

```ts
export default defineConfig({
  optimizeDeps: {
    // 已弃用
    esbuildOptions: {},
    // 改用
    rolldownOptions: {}
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/dep-pre-bundling.html
-->
