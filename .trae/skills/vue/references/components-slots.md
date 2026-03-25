---
name: component-slots
description: 使用默认插槽、具名插槽和作用域插槽向子组件传递模板内容
---

# 组件插槽

插槽允许父组件向子组件传递模板内容。

## 基本插槽

带有插槽出口的子组件：

```vue
<!-- FancyButton.vue -->
<template>
  <button class="fancy-btn">
    <slot></slot> <!-- 插槽出口 -->
  </button>
</template>
```

父组件传递插槽内容：

```vue-html
<FancyButton>
  点击我！
</FancyButton>
```

渲染为：

```html
<button class="fancy-btn">点击我！</button>
```

## 后备内容

当没有提供插槽内容时提供默认内容：

```vue
<template>
  <button>
    <slot>提交</slot> <!-- "提交" 是后备内容 -->
  </button>
</template>
```

## 具名插槽

使用多个带名称的插槽：

```vue
<!-- BaseLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot> <!-- 默认插槽 -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

使用 `v-slot` 或 `#` 简写来指定具名插槽：

```vue-html
<BaseLayout>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <p>主要内容放在这里</p>

  <template #footer>
    <p>联系信息</p>
  </template>
</BaseLayout>
```

## 作用域插槽

从子组件向父组件插槽内容传递数据：

```vue
<!-- MyComponent.vue -->
<template>
  <div>
    <slot :text="greetingMessage" :count="1"></slot>
  </div>
</template>

<script setup lang="ts">
const greetingMessage = 'hello'
</script>
```

在父组件中接收插槽 props：

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

<!-- 或使用解构 -->
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 具名作用域插槽

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps.title }}
  </template>

  <template #default="{ message }">
    {{ message }}
  </template>
</MyComponent>
```

## 条件插槽

使用 `$slots` 检查插槽是否有内容：

```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
  </div>
</template>
```

## 动态插槽名

```vue-html
<template #[dynamicSlotName]>
  ...
</template>
```

## 无渲染组件

仅通过作用域插槽提供逻辑的组件：

```vue
<!-- MouseTracker.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(e: MouseEvent) {
  x.value = e.pageX
  y.value = e.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  <slot :x="x" :y="y"></slot>
</template>
```

使用：

```vue-html
<MouseTracker v-slot="{ x, y }">
  鼠标：{{ x }}, {{ y }}
</MouseTracker>
```

> 注意：对于纯逻辑复用，通常更推荐使用 Composables 而非无渲染组件。

## 渲染作用域

- 插槽内容可以访问父组件作用域
- 插槽内容**不能**访问子组件作用域
- 使用作用域插槽来暴露子组件数据

<!-- 
Source references:
- https://vuejs.org/guide/components/slots.html
-->
