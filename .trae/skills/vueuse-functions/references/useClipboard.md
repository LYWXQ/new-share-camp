---
category: 浏览器
---

# useClipboard

响应式 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API)。提供响应剪贴板命令（剪切、复制和粘贴）以及异步读取和写入系统剪贴板的能力。对剪贴板内容的访问由 [Permissions API](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API) 控制。没有用户权限，不允许读取或更改剪贴板内容。

<CourseLink href="https://vueschool.io/lessons/reactive-browser-wrappers-in-vueuse-useclipboard?friend=vueuse">通过 Vue School 的免费视频课程学习如何响应式地将文本保存到剪贴板！</CourseLink>

## 用法

```vue
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
  <div v-if="isSupported">
    <button @click="copy(source)">
      <!-- 默认情况下，`copied` 将在 1.5 秒后重置 -->
      <span v-if="!copied">复制</span>
      <span v-else>已复制！</span>
    </button>
    <p>当前复制的内容: <code>{{ text || '无' }}</code></p>
  </div>
  <p v-else>
    您的浏览器不支持 Clipboard API
  </p>
</template>
```

设置 `legacy: true` 以在 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 不可用时保持复制能力。它将使用 [execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand) 作为后备处理复制。

## 组件用法

```vue
<template>
  <UseClipboard v-slot="{ copy, copied }" source="复制我">
    <button @click="copy()">
      {{ copied ? '已复制' : '复制' }}
    </button>
  </UseClipboard>
</template>
```

## 类型声明

```ts
export interface UseClipboardOptions<Source> extends ConfigurableNavigator {
  /**
   * 启用剪贴板读取
   *
   * @default false
   */
  read?: boolean
  /**
   * 复制源
   */
  source?: Source
  /**
   * 重置 `copied` ref 状态的毫秒数
   *
   * @default 1500
   */
  copiedDuring?: number
  /**
   * 如果剪贴板未定义，是否回退到 document.execCommand('copy')。
   *
   * @default false
   */
  legacy?: boolean
}
export interface UseClipboardReturn<Optional> {
  isSupported: ComputedRef<boolean>
  text: Readonly<ShallowRef<string>>
  copied: Readonly<ShallowRef<boolean>>
  copy: Optional extends true
    ? (text?: string) => Promise<void>
    : (text: string) => Promise<void>
}
/**
 * 响应式 Clipboard API。
 *
 * @see https://vueuse.org/useClipboard
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useClipboard(
  options?: UseClipboardOptions<undefined>,
): UseClipboardReturn<false>
export declare function useClipboard(
  options: UseClipboardOptions<MaybeRefOrGetter<string>>,
): UseClipboardReturn<true>
```
