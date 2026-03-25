---
name: vitesse-uni-app
description: 基于 Vite 的 uni-app 启动模板 - 包含最佳实践，做什么：基于 Vite 的 uni-app 启动模板，包含预设工具、现代开发体验和最佳实践；何时调用：当用户需要了解 vitesse-uni-app 模板结构、使用其预设配置或基于该模板开发时调用
---

# vitesse-uni-app

基于 Vite 的 uni-app 启动模板，包含最佳实践。包含预设工具和现代开发体验。

## 特性

- ⚡️ **Vite** - 快速的开发和构建
- 🌍 **uni-app** - 跨平台开发
- 🖖 **Vue 3** - 组合式 API、`<script setup>`
- 🔷 **TypeScript** - 类型安全
- 🎨 **UnoCSS** - 原子 CSS
- 📦 **自动导入** - 组件和组合式函数
- 🗂 **基于文件的路由** - vite-plugin-uni-pages
- 📐 **布局系统** - 类似 Nuxt 的布局
- 🔧 **ESLint** - 代码检查

## 快速开始

```bash
# 使用 create-uni 创建
npm create uni@latest my-app --template vitesse

# 或直接克隆
git clone https://github.com/uni-helper/vitesse-uni-app.git my-app
```

## 项目结构

```
vitesse-uni-app/
├── src/
│   ├── components/          # 自动导入的组件
│   ├── composables/         # 自动导入的组合式函数
│   ├── layouts/             # 布局组件
│   │   ├── default.vue
│   │   └── home.vue
│   ├── pages/               # 基于文件的路由
│   │   ├── index.vue
│   │   └── about/
│   │       └── index.vue
│   ├── static/              # 静态资源
│   ├── stores/              # Pinia stores
│   ├── styles/              # 全局样式
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.config.ts   # TypeScript 清单
│   └── pages.config.ts      # 全局页面配置
├── types/                   # 类型定义
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── uno.config.ts
└── eslint.config.js
```

## 预设插件

模板包含这些预设插件：

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    UniComponents({
      resolvers: [AnoUIResolver()],
    }),
    UniPages(),
    UniLayouts(),
    UniManifest(),
    Uni(),
  ],
})
```

## 自动导入

### 组件

`src/components/` 中的组件自动导入：

```vue
<template>
  <!-- 无需导入 -->
  <MyButton />
</template>
```

### 组合式函数

`src/composables/` 中的文件自动导入：

```ts
// src/composables/useCounter.ts
export function useCounter() {
  const count = ref(0)
  const inc = () => count.value++
  return { count, inc }
}
```

```vue
<script setup>
// 无需导入
const { count, inc } = useCounter()
</script>
```

### Vue API

Vue API 自动导入：

```vue
<script setup>
// 无需导入 ref、computed 等
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

## 路由

`src/pages/` 中的基于文件路由：

```
pages/
├── index.vue           # /pages/index/index
├── about.vue           # /pages/about/index
└── user/
    ├── index.vue       # /pages/user/index
    └── [id].vue        # /pages/user/:id
```

### 页面配置

```vue
<script setup>
definePage({
  style: {
    navigationBarTitleText: '关于',
  },
  layout: 'default',
})
</script>
```

## 布局

在 `src/layouts/` 中创建布局：

```vue
<!-- src/layouts/default.vue -->
<template>
  <view class="layout">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </view>
</template>
```

在页面中应用：

```vue
<script setup>
definePage({
  layout: 'default',
})
</script>

<template>
  <template #header>
    <NavBar />
  </template>
  <div>内容</div>
</template>
```

## 使用 UnoCSS 样式

```vue
<template>
  <view class="p-32 bg-gray-100">
    <text class="text-32 font-bold text-primary">
      使用 UnoCSS 设置样式
    </text>
  </view>
</template>
```

## 使用 Pinia 状态管理

```ts
// src/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const isLoggedIn = computed(() => !!name.value)

  function login(userName: string) {
    name.value = userName
  }

  return { name, isLoggedIn, login }
})
```

```vue
<script setup>
const user = useUserStore()
</script>
```

## 数据获取

```vue
<script setup>
const { data: users, pending, error } = useFetch('/api/users')
</script>

<template>
  <view v-if="pending">加载中...</view>
  <view v-else-if="error">错误: {{ error.message }}</view>
  <view v-else>
    <view v-for="user in users" :key="user.id">
      {{ user.name }}
    </view>
  </view>
</template>
```

## 部署

### 生产构建

```bash
npm run build
```

### 平台特定构建

```bash
# H5
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# App
npm run build:app
```

<!--
Source references:
- https://github.com/uni-helper/vitesse-uni-app
- https://uni-helper.js.org/vitesse-uni-app
-->
