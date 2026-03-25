---
name: unocss-layers-preflights
description: CSS 层排序和原始 CSS 注入
---

# 层和预检

控制 CSS 输出顺序和注入全局 CSS。

## 层

在规则上设置层：

```ts
rules: [
  [/^m-(\d)$/, ([, d]) => ({ margin: `${d / 4}rem` }), { layer: 'utilities' }],
  ['btn', { padding: '4px' }], // 默认层
]
```

### 层排序

```ts
layers: {
  'components': -1,
  'default': 1,
  'utilities': 2,
}
```

### 单独导入层

```ts
import 'uno:components.css'
import 'uno.css'
import './my-custom.css'
import 'uno:utilities.css'
```

### CSS 级联层

```ts
outputToCssLayers: true

// 或使用自定义名称
outputToCssLayers: {
  cssLayerName: (layer) => {
    if (layer === 'default') return 'utilities'
    if (layer === 'shortcuts') return 'utilities.shortcuts'
  }
}
```

## 层变体

```html
<!-- UnoCSS 层 -->
<p class="uno-layer-my-layer:text-xl">

<!-- CSS @layer -->
<p class="layer-my-layer:text-xl">
```

## 预检

全局注入原始 CSS：

```ts
preflights: [
  {
    getCSS: ({ theme }) => `
      * {
        color: ${theme.colors.gray?.[700] ?? '#333'};
        margin: 0;
      }
    `,
  },
]
```

带层：

```ts
preflights: [
  {
    layer: 'base',
    getCSS: () => `html { font-family: system-ui; }`,
  },
]
```

## preset-wind4 层

| 层 | 描述 | 顺序 |
|-------|-------------|-------|
| `properties` | CSS @property 规则 | -200 |
| `theme` | 主题 CSS 变量 | -150 |
| `base` | 重置样式 | -100 |

<!-- 
Source references:
- https://unocss.dev/config/layers
- https://unocss.dev/config/preflights
-->
