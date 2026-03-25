---
name: vite-plugin-uni-middleware
description: uni-app 路由中间件支持 - 实现守卫、认证和页面生命周期钩子，做什么：为 uni-app 路由添加 Express 风格的中间件支持，实现认证守卫、页面分析和自定义路由逻辑；何时调用：当用户需要实现路由守卫、页面级认证、导航拦截或页面分析跟踪时调用
---

# vite-plugin-uni-middleware

为 uni-app 路由添加 Express 风格的中间件支持。实现认证守卫、页面分析和自定义路由逻辑。

## 安装

```bash
npm i -D @uni-helper/vite-plugin-uni-middleware
```

## 设置

```ts
// vite.config.ts
import Uni from '@dcloudio/vite-plugin-uni'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UniMiddleware(), Uni()],
})
```

## 创建中间件

在 `src/middleware/` 目录中创建中间件文件：

```ts
// src/middleware/auth.ts
import { defineMiddleware } from '@uni-helper/vite-plugin-middleware'

export default defineMiddleware((to, from, next) => {
  const token = uni.getStorageSync('token')

  if (!token && to.path !== '/pages/login/index') {
    // 重定向到登录页
    next('/pages/login/index')
  } else {
    // 继续导航
    next()
  }
})
```

```ts
// src/middleware/analytics.ts
export default defineMiddleware((to, from, next) => {
  // 跟踪页面浏览
  uni.report('page_view', {
    path: to.path,
    from: from.path,
    timestamp: Date.now(),
  })

  next()
})
```

```ts
// src/middleware/logger.ts
export default defineMiddleware((to, from, next) => {
  console.log(`[路由] ${from.path} -> ${to.path}`)
  next()
})
```

## 应用中间件

### 通过 definePage（推荐）

```vue
<script setup>
definePage({
  middlewares: ['auth', 'analytics'],
})
</script>
```

### 通过 pages.json

```json
{
  "pages": [{
    "path": "pages/profile/index",
    "middlewares": ["auth"]
  }]
}
```

### 全局中间件

创建 `src/middleware/index.ts` 作为全局中间件：

```ts
// src/middleware/index.ts
export default defineMiddleware((to, from, next) => {
  // 每次导航都运行
  console.log('全局中间件')
  next()
})
```

## 中间件上下文

```ts
interface MiddlewareContext {
  to: {
    path: string
    query: Record<string, string>
    meta?: Record<string, any>
  }
  from: {
    path: string
    query: Record<string, string>
  }
  next: (path?: string) => void
}
```

## 中间件执行顺序

中间件按声明顺序执行：

```vue
<script setup>
definePage({
  // 执行顺序：logger -> auth -> analytics
  middlewares: ['logger', 'auth', 'analytics'],
})
</script>
```

## 导航控制

```ts
export default defineMiddleware((to, from, next) => {
  // 继续到路由
  next()

  // 重定向到不同路由
  next('/pages/other/index')

  // 带查询参数重定向
  next({
    path: '/pages/login/index',
    query: { redirect: to.path },
  })

  // 取消导航（停留在当前页面）
  next(false)
})
```

## 异步中间件

```ts
export default defineMiddleware(async (to, from, next) => {
  try {
    const user = await fetchUserInfo()

    if (user.isBanned) {
      next('/pages/banned/index')
    } else {
      next()
    }
  } catch (error) {
    next('/pages/error/index')
  }
})
```

<!--
Source references:
- https://github.com/uni-helper/vite-plugin-uni-middleware
- https://uni-helper.js.org/vite-plugin-uni-middleware
-->
