---
name: unocss-extracting
description: UnoCSS 如何从源代码中提取工具类
---

# 提取

UnoCSS 在代码库中搜索工具类用法并即时生成 CSS。

## 内容源

### 管道提取（Vite/Webpack）

最高效 - 从构建工具管道中提取。

**默认文件类型：** `.jsx`、`.tsx`、`.vue`、`.md`、`.html`、`.svelte`、`.astro`、`.marko`

**默认不包含：** `.js`、`.ts`

```ts
export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|html)($|\?)/,
        'src/**/*.{js,ts}', // 添加 js/ts
      ],
    },
  },
})
```

### 文件系统提取

用于不在构建管道中的文件：

```ts
export default defineConfig({
  content: {
    filesystem: [
      'src/**/*.php',
      'public/*.html',
    ],
  },
})
```

### 内联文本提取

```ts
export default defineConfig({
  content: {
    inline: [
      '<div class="p-4 text-red">Some text</div>',
      async () => (await fetch('https://example.com')).text(),
    ],
  },
})
```

## 魔法注释

### @unocss-include

强制扫描文件：

```ts
// @unocss-include
export const classes = {
  active: 'bg-primary text-white',
}
```

### @unocss-ignore

跳过整个文件：

```ts
// @unocss-ignore
```

### @unocss-skip-start / @unocss-skip-end

跳过特定块：

```html
<p class="text-green">已提取</p>
<!-- @unocss-skip-start -->
<p class="text-red">不提取</p>
<!-- @unocss-skip-end -->
```

## 限制

UnoCSS 在**构建时**工作 - 动态类不起作用：

```html
<!-- 不会生效！ -->
<div class="p-${size}"></div>
```

### 解决方案

**1. 安全列表** - 预生成已知值：

```ts
safelist: ['p-1', 'p-2', 'p-3', 'p-4']
```

**2. 静态映射** - 静态列出组合：

```ts
const colors = {
  red: 'text-red border-red',
  blue: 'text-blue border-blue',
}
```

**3. 运行时** - 使用 `@unocss/runtime` 实现真正的运行时生成。

## 自定义提取器

```ts
extractors: [
  {
    name: 'my-extractor',
    extract({ code }) {
      return code.match(/class:[\w-]+/g) || []
    },
  },
]
```

<!-- 
Source references:
- https://unocss.dev/guide/extracting
-->
