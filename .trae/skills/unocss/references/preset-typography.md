---
name: preset-typography
description: 为原始 HTML 内容添加排版默认值的 Prose 类
---

# Preset Typography

为原始 HTML 内容添加排版默认值的 Prose 类。

## 安装

```ts
import { defineConfig, presetTypography, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(), // 必需！
    presetTypography(),
  ],
})
```

## 基本用法

```html
<article class="prose">
  <h1>我的文章</h1>
  <p>使用排版默认值进行样式设置...</p>
</article>
```

## 尺寸

```html
<article class="prose prose-sm">小</article>
<article class="prose prose-base">基础（默认）</article>
<article class="prose prose-lg">大</article>
<article class="prose prose-xl">特大</article>
<article class="prose prose-2xl">2X 大</article>
```

响应式：
```html
<article class="prose prose-sm md:prose-base lg:prose-lg">
  响应式排版
</article>
```

## 颜色

```html
<article class="prose prose-gray">灰色（默认）</article>
<article class="prose prose-slate">石板色</article>
<article class="prose prose-blue">蓝色</article>
```

## 深色模式

```html
<article class="prose dark:prose-invert">
  深色模式排版
</article>
```

## 排除元素

```html
<article class="prose">
  <p>已设置样式</p>
  <div class="not-prose">
    <p>未设置样式</p>
  </div>
</article>
```

**注意：** `not-prose` 只能作为 class 使用。

## 选项

```ts
presetTypography({
  selectorName: 'prose',      // 自定义选择器
  cssVarPrefix: '--un-prose', // CSS 变量前缀
  important: false,           // 设为 !important
  cssExtend: {
    'code': { color: '#8b5cf6' },
    'a:hover': { color: '#f43f5e' },
  },
})
```

<!-- 
Source references:
- https://unocss.dev/presets/typography
-->
