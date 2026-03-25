---
name: features-assets
description: Vite 中的静态资源处理，包括导入、public 目录和 URL 处理
---

# 静态资源处理

## 将资源导入为 URL

```ts
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
// 开发: /src/img.png
// 构建: /assets/img.2d8efhg.png
```

常见的图像、媒体和字体类型会自动检测。

## 导入查询

### 显式 URL 导入

```ts
import workletURL from './worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### 作为字符串导入（原始）

```ts
import shaderString from './shader.glsl?raw'
```

### 控制内联

```ts
import imgUrl1 from './img.svg?no-inline'  // 从不内联
import imgUrl2 from './img.png?inline'      // 始终作为 base64 内联
```

## 资源内联

小于 `assetsInlineLimit`（默认 4KB）的资源作为 base64 内联：

```ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,  // 4KB
    // 或使用回调进行精细控制
    assetsInlineLimit: (filePath) => {
      return !filePath.endsWith('.svg')
    }
  }
})
```

## `public` 目录

`public/` 中的文件：
- 开发期间在根路径 `/` 提供服务
- 构建期间原样复制到 `dist/` 根目录
- 不进行处理或哈希

```
public/
  favicon.ico  → /favicon.ico
  robots.txt   → /robots.txt
```

在源代码中使用绝对路径引用：

```html
<img src="/icon.png" />
```

配置目录：

```ts
export default defineConfig({
  publicDir: 'static'  // 或 false 禁用
})
```

## 扩展资源类型

```ts
export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.hdr']
})
```

## 使用 import.meta.url 的动态 URL

```ts
// 在现代浏览器中原生工作
const imgUrl = new URL('./img.png', import.meta.url).href

// 动态模式（有限）
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

**限制：**
- URL 字符串必须是静态的以便构建分析
- 不适用于 SSR（Node.js 与浏览器中的语义不同）

## TypeScript 支持

添加 `vite/client` 到类型以识别资源导入：

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## CSS 中的 URL 处理

```css
.hero {
  background: url('./img.png');  /* 已处理并重新定位 */
}
```

对于动态构造的 SVG URL：

```ts
import imgUrl from './img.svg'
element.style.background = `url("${imgUrl}")`  // 注意双引号
```

<!-- 
Source references:
- https://vite.dev/guide/assets.html
-->
