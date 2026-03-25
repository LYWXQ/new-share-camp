---
name: unocss-configuration
description: UnoCSS 的配置文件设置和所有配置选项
---

# UnoCSS 配置

UnoCSS 通过项目根目录中的专用配置文件进行配置。

## 配置文件

**推荐：** 使用专用的 `uno.config.ts` 文件以获得最佳的 IDE 支持和热模块替换（HMR）。

```ts
// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    }
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
```

UnoCSS 会自动在项目根目录中查找 `uno.config.{js,ts,mjs,mts}` 或 `unocss.config.{js,ts,mjs,mts}`。

## 关键配置选项

### rules
定义 CSS 工具类规则。后面的条目优先级更高。

```ts
rules: [
  ['m-1', { margin: '0.25rem' }],
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
]
```

### shortcuts
将多个规则组合为单个简写。

```ts
shortcuts: {
  'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
}
```

### theme
用于规则间共享设计令牌的主题对象。

```ts
theme: {
  colors: {
    brand: '#942192',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
  },
}
```

### presets
预定义的配置，捆绑了规则、变体和主题。

```ts
presets: [
  presetWind3(),
  presetIcons(),
]
```

### transformers
转换源代码以支持特殊语法。

```ts
transformers: [
  transformerDirectives(),
  transformerVariantGroup(),
]
```

### variants
预处理选择器，具有重写 CSS 输出的能力。

### extractors
处理源文件并提取工具类名称。

### preflights
全局注入原始 CSS。

### layers
控制 CSS 层的顺序。默认为 `0`。

```ts
layers: {
  'components': -1,
  'default': 1,
  'utilities': 2,
}
```

### safelist
始终包含在输出中的工具类。

```ts
safelist: ['p-1', 'p-2', 'p-3']
```

### blocklist
始终排除的工具类。

```ts
blocklist: ['p-1', /^p-[2-4]$/]
```

### content
配置从何处提取工具类。

```ts
content: {
  pipeline: {
    include: [/\.(vue|svelte|tsx|html)($|\?)/],
  },
  filesystem: ['src/**/*.php'],
}
```

### separators
变体分隔符字符。默认：`[':', '-']`

### outputToCssLayers
将 UnoCSS 层输出为 CSS 级联层。

```ts
outputToCssLayers: true
```

## 指定配置文件位置

```ts
// vite.config.ts
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UnoCSS({
      configFile: '../my-uno.config.ts',
    }),
  ],
})
```

<!-- 
Source references:
- https://unocss.dev/guide/config-file
- https://unocss.dev/config/
-->
