---
category: 浏览器
related:
  - useColorMode
  - usePreferredDark
  - useStorage
---

# useDark

响应式深色模式并自动持久化数据。

<CourseLink href="https://vueschool.io/lessons/theming-with-vueuse-usedark-and-usecolormode?friend=vueuse">通过 Vue School 的免费视频课程学习 useDark！</CourseLink>

## 基本用法

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

## 行为

`useDark` 结合 `usePreferredDark` 和 `useStorage`。启动时，它从 localStorage/sessionStorage（键可配置）读取值以查看是否有用户配置的颜色方案，如果没有，它将使用用户的系统偏好。当您更改 `isDark` ref 时，它将更新相应元素的属性，然后将偏好存储到存储中（默认键：`vueuse-color-scheme`）以进行持久化。

> 请注意，`useDark` 仅为您处理 DOM 属性更改以在 CSS 中应用适当的选择器。它**不**处理实际的样式、主题或 CSS。

## 配置

默认情况下，它使用 [Tailwind CSS 偏好的深色模式](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)，当 `html` 标签应用 `dark` 类时启用深色模式，例如：

```html
<!--浅色-->
<html>
  ...
</html>

<!--深色-->
<html class="dark">
  ...
</html>
```

不过，您也可以自定义它以使其与大多数 CSS 框架一起工作。

例如：

```ts
import { useDark } from '@vueuse/core'
// ---cut---
const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})
```

将工作如下

```html
<!--浅色-->
<html>
  <body color-scheme="light">
    ...
  </body>
</html>

<!--深色-->
<html>
  <body color-scheme="dark">
    ...
  </body>
</html>
```

如果上述配置仍然不符合您的需求，您可以使用 `onChanged` 选项来完全控制如何处理更新。

```ts
import { useDark } from '@vueuse/core'
// ---cut---
const isDark = useDark({
  onChanged(dark) {
    // 更新 dom，调用 API 或其他操作
  },
})
```

## 组件用法

```vue
<template>
  <UseDark v-slot="{ isDark, toggleDark }">
    <button @click="toggleDark()">
      是否深色: {{ isDark }}
    </button>
  </UseDark>
</template>
```

## 类型声明

```ts
export interface UseDarkOptions
  extends Omit<UseColorModeOptions<BasicColorSchema>, "modes" | "onChanged"> {
  /**
   * 当 isDark=true 时应用于目标元素的值
   *
   * @default 'dark'
   */
  valueDark?: string
  /**
   * 当 isDark=false 时应用于目标元素的值
   *
   * @default ''
   */
  valueLight?: string
  /**
   * 处理更新的自定义处理程序。
   * 指定时，将覆盖默认行为。
   *
   * @default undefined
   */
  onChanged?: (
    isDark: boolean,
    defaultHandler: (mode: BasicColorSchema) => void,
    mode: BasicColorSchema,
  ) => void
}
/**
 * 响应式深色模式并自动持久化数据。
 *
 * @see https://vueuse.org/useDark
 * @param options
 */
export declare function useDark(
  options?: UseDarkOptions,
): WritableComputedRef<boolean, boolean>
export type UseDarkReturn = ReturnType<typeof useDark>
```
