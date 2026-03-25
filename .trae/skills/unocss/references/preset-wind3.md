---
name: preset-wind3
description: 用于 UnoCSS 的兼容 Tailwind CSS / Windi CSS 的预设
---

# Preset Wind3

兼容 Tailwind CSS / Windi CSS 的预设。UnoCSS 中最常用的预设。

## 安装

```ts
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
  ],
})
```

**注意：** `@unocss/preset-uno` 和 `@unocss/preset-wind` 已弃用，已重命名为 `@unocss/preset-wind3`。

## 特性

- 完全兼容 Tailwind CSS v3
- 深色模式（`dark:`、`@dark:`）
- 所有响应式变体（`sm:`、`md:`、`lg:`、`xl:`、`2xl:`）
- 所有标准工具类（flex、grid、spacing、colors、typography 等）
- 动画支持（包含 Animate.css 动画）

## 深色模式

### 基于类（默认）

```html
<div class="dark:bg-gray-800">
```

生成：`.dark .dark\:bg-gray-800 { ... }`

### 基于媒体查询

```ts
presetWind3({
  dark: 'media'
})
```

生成：`@media (prefers-color-scheme: dark) { ... }`

### 选择性媒体查询

无论配置如何都使用 `@dark:`：

```html
<div class="@dark:bg-gray-800">
```

## 选项

```ts
presetWind3({
  // 深色模式策略
  dark: 'class', // 'class' | 'media' | { light: '.light', dark: '.dark' }
  
  // 将伪选择器生成为 [group=""] 而不是 .group
  attributifyPseudo: false,
  
  // CSS 自定义属性前缀
  variablePrefix: 'un-',
  
  // 工具类前缀
  prefix: '',
  
  // 生成预检 CSS
  preflight: true, // true | false | 'on-demand'
  
  // 将所有工具类标记为 !important
  important: false, // boolean | string (选择器)
})
```

### Important 选项

使所有工具类为 `!important`：

```ts
presetWind3({
  important: true,
})
```

或使用选择器限定范围以增加特异性而不使用 `!important`：

```ts
presetWind3({
  important: '#app',
})
```

输出：`#app :is(.dark .dark\:bg-blue) { ... }`

## 与 Tailwind CSS 的差异

### 不支持引号

由于提取器的原因，模板引号不起作用：

```html
<!-- 不会生效 -->
<div class="before:content-['']">

<!-- 请改用快捷方式 -->
<div class="before:content-empty">
```

### 背景位置

对自定义值使用 `position:` 前缀：

```html
<!-- Tailwind -->
<div class="bg-[center_top_1rem]">

<!-- UnoCSS -->
<div class="bg-[position:center_top_1rem]">
```

### 动画

UnoCSS 集成了 Animate.css。当名称冲突时，使用 `-alt` 后缀表示 Animate.css 版本：

- `animate-bounce` - Tailwind 版本
- `animate-bounce-alt` - Animate.css 版本

自定义动画：

```ts
theme: {
  animation: {
    keyframes: {
      custom: '{0%, 100% { opacity: 0; } 50% { opacity: 1; }}',
    },
    durations: {
      custom: '1s',
    },
    timingFns: {
      custom: 'ease-in-out',
    },
    counts: {
      custom: 'infinite',
    },
  }
}
```

## 与 Windi CSS 的差异

| Windi CSS | UnoCSS |
|-----------|--------|
| `<sm:p-1` | `lt-sm:p-1` |
| `@lg:p-1` | `at-lg:p-1` |
| `>xl:p-1` | `xl:p-1` |

括号语法使用 `_` 而不是 `,`：

```html
<!-- Windi CSS -->
<div class="grid-cols-[1fr,10px,max-content]">

<!-- UnoCSS -->
<div class="grid-cols-[1fr_10px_max-content]">
```

## 实验性：媒体悬停

解决触摸设备上的粘性悬停问题：

```html
<div class="@hover-text-red">
```

生成：
```css
@media (hover: hover) and (pointer: fine) {
  .\@hover-text-red:hover { ... }
}
```

<!-- 
Source references:
- https://unocss.dev/presets/wind3
-->
