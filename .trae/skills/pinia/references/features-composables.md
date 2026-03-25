---
name: composables-in-stores
description: 在 Pinia store 中使用 Vue 组合式函数
---

# Store 中的组合式函数

Pinia store 可以利用 Vue 组合式函数实现可复用的状态逻辑。

## Option Stores

在 `state` 属性内部调用组合式函数，但仅限于返回可写 ref 的函数：

```ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

**有效：** 返回 `ref()` 的组合式函数：
- `useLocalStorage`
- `useAsyncState`

**在 Option Stores 中无效：**
- 暴露函数的组合式函数
- 暴露只读数据的组合式函数

## Setup Stores

更灵活 - 可以使用几乎所有组合式函数：

```ts
import { defineStore } from 'pinia'
import { useMediaControls } from '@vueuse/core'
import { ref } from 'vue'

export const useVideoPlayer = defineStore('video', () => {
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/data/video.mp4')
  const { playing, volume, currentTime, togglePictureInPicture } =
    useMediaControls(videoElement, { src })

  function loadVideo(element: HTMLVideoElement, newSrc: string) {
    videoElement.value = element
    src.value = newSrc
  }

  return {
    src,
    playing,
    volume,
    currentTime,
    loadVideo,
    togglePictureInPicture,
  }
})
```

**注意：** 不要返回不可序列化的 DOM ref 如 `videoElement` - 它们是内部实现细节。

## SSR 注意事项

### 使用 hydrate() 的 Option Stores

定义一个 `hydrate()` 函数来处理客户端注水：

```ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // 忽略服务端状态，从浏览器读取
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

### 使用 skipHydrate() 的 Setup Stores

标记不应从服务端注水的 state：

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

export const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)

  return {
    // 跳过仅客户端 state 的注水
    lastColor: skipHydrate(lastColor),
    open,       // 函数 - 不需要注水
    isSupported, // 布尔值 - 非响应式
  }
})
```

`skipHydrate()` 仅适用于 state 属性（refs），不适用于函数或非响应式值。

<!--
Source references:
- https://pinia.vuejs.org/cookbook/composables.html
-->
