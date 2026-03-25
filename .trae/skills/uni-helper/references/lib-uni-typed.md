---
name: uni-typed
description: uni-app 模板的 TypeScript 类型定义 - 为 uni-app 组件提供完整的类型安全，做什么：为 uni-app 模板部分提供 TypeScript 类型定义，包括组件属性类型检查、事件处理器类型安全和组件引用类型推断；何时调用：当用户需要为 uni-app 模板添加类型支持、处理组件事件类型或获取组件引用类型时调用
---

# uni-typed

uni-app 模板部分的 TypeScript 类型定义。为 uni-app 组件提供完整的类型安全和智能提示。

## 安装

```bash
# 用于 uni-app
npm i -D @uni-helper/uni-app-types

# 用于 uni-ui
npm i -D @uni-helper/uni-ui-types

# 用于 uni-cloud
npm i -D @uni-helper/uni-cloud-types
```

## 设置

### Uni-app 类型

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@uni-helper/uni-app-types"]
  }
}
```

### Uni-ui 类型

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "@uni-helper/uni-app-types",
      "@uni-helper/uni-ui-types"
    ]
  }
}
```

## 特性

- 类型安全的模板事件处理器
- 组件属性类型检查
- 自定义事件类型定义
- 组件引用的类型推断

## 组件类型

### 模板类型安全

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
const count = ref(0)

const handleInput = (e: UniHelper.InputOnInputEvent) => {
  inputValue.value = e.detail.value
}

const handleChange = (e: UniHelper.SwitchOnChangeEvent) => {
  console.log(e.detail.value)
}
</script>

<template>
  <!-- 类型安全的组件使用 -->
  <input
    type="text"
    :value="inputValue"
    @input="handleInput"
  />

  <switch :checked="true" @change="handleChange" />
</template>
```

### 组件引用类型

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 类型安全的组件引用
const videoRef = ref<UniHelper.VideoInstance>()
const mapRef = ref<UniHelper.MapInstance>()

onMounted(() => {
  // 组件方法的智能提示
  videoRef.value?.play()
  videoRef.value?.pause()
  videoRef.value?.seek(100)

  mapRef.value?.moveToLocation({
    latitude: 39.9,
    longitude: 116.4,
  })
})
</script>

<template>
  <video ref="videoRef" src="..." />
  <map ref="mapRef" />
</template>
```

## 事件类型

### 常见事件类型

```ts
// 输入事件
UniHelper.InputOnInputEvent
UniHelper.InputOnBlurEvent
UniHelper.InputOnFocusEvent

// 表单事件
UniHelper.SwitchOnChangeEvent
UniHelper.CheckboxOnChangeEvent
UniHelper.RadioOnChangeEvent
UniHelper.PickerOnChangeEvent
UniHelper.SliderOnChangeEvent

// 媒体事件
UniHelper.VideoOnPlayEvent
UniHelper.VideoOnPauseEvent
UniHelper.VideoOnEndedEvent
UniHelper.VideoOnTimeUpdateEvent

// 触摸事件
UniHelper.ViewOnTouchstartEvent
UniHelper.ViewOnTouchmoveEvent
UniHelper.ViewOnTouchendEvent
UniHelper.ViewOnTapEvent
UniHelper.ViewOnLongpressEvent

// 滚动事件
UniHelper.ScrollViewOnScrollEvent
UniHelper.ScrollViewOnScrolltolowerEvent
UniHelper.ScrollViewOnScrolltoupperEvent
```

### 自定义事件

为你的组件定义自定义事件类型：

```vue
<script setup lang="ts">
// 子组件
const emit = defineEmits<{
  change: [value: string]
  submit: [data: { id: number; name: string }]
}>()
</script>
```

```vue
<script setup lang="ts">
// 父组件
import type { MyComponentOnChangeEvent } from './types'

const handleChange = (e: MyComponentOnChangeEvent) => {
  console.log(e.detail.value)
}
</script>

<template>
  <my-component @change="handleChange" />
</template>
```

## 为什么选择 uni-typed？

DCloud 的 `@dcloudio/types` 只提供 script 部分的 TypeScript 支持。uni-typed 填补了模板部分类型安全的空白，提供：

- 组件属性验证
- 事件处理器类型检查
- 组件引用上的方法智能提示
- 更好的 IDE 支持（VS Code、WebStorm）

## 从 v0 迁移到 v1

请参阅[迁移指南](https://uni-helper.js.org/uni-typed/other/migrate-v0-to-v1)了解升级说明。

<!--
Source references:
- https://github.com/uni-helper/uni-typed
- https://uni-helper.js.org/uni-typed
-->
