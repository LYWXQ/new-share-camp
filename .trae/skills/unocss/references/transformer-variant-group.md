---
name: transformer-variant-group
description: 使用公共前缀分组工具类的简写
---

# Transformer Variant Group

启用使用公共前缀分组工具类的简写语法。

## 安装

```ts
import { defineConfig, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [
    transformerVariantGroup(),
  ],
})
```

## 用法

使用括号将多个工具类分组在一个变体前缀下：

```html
<!-- 转换前 -->
<div class="hover:(bg-gray-400 font-medium) font-(light mono)" />

<!-- 转换后 -->
<div class="hover:bg-gray-400 hover:font-medium font-light font-mono" />
```

## 示例

### 悬停状态

```html
<button class="hover:(bg-blue-600 text-white scale-105)">
  悬停我
</button>
```

展开为：`hover:bg-blue-600 hover:text-white hover:scale-105`

### 深色模式

```html
<div class="dark:(bg-gray-800 text-white)">
  深色内容
</div>
```

展开为：`dark:bg-gray-800 dark:text-white`

### 响应式

```html
<div class="md:(flex items-center gap-4)">
  响应式弹性布局
</div>
```

展开为：`md:flex md:items-center md:gap-4`

### 嵌套分组

```html
<div class="lg:hover:(bg-blue-500 text-white)">
  大屏幕悬停
</div>
```

展开为：`lg:hover:bg-blue-500 lg:hover:text-white`

### 多个前缀

```html
<div class="text-(sm gray-600) font-(medium mono)">
  样式化文字
</div>
```

展开为：`text-sm text-gray-600 font-medium font-mono`

## 要点

- 使用括号 `()` 对工具类分组
- 前缀应用于组内的所有工具类
- 可与任何变体组合（hover、dark、响应式等）
- 支持嵌套
- 在 class 属性和其他提取源中工作

<!-- 
Source references:
- https://unocss.dev/transformers/variant-group
-->
