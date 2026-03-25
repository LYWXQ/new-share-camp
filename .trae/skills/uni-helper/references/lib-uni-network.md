---
name: uni-network
description: 基于 Promise 的 uni-app HTTP 客户端 - 类似 axios 的 API，使用 uni.request 作为默认传输层，做什么：提供 HTTP 请求、拦截器、请求取消、上传下载等功能；何时调用：当用户需要进行网络请求、配置 HTTP 客户端、处理请求响应拦截或实现文件上传下载时调用
---

# uni-network

基于 Promise 的 uni-app HTTP 客户端，灵感来自 axios@0.27.2。使用 uni.request/uni.uploadFile/uni.downloadFile 作为底层传输。

## 安装

```bash
npm i @uni-helper/uni-network
```

## 特性

- 基于 Promise 的 API
- 请求/响应拦截器
- 请求取消
- TypeScript 支持
- 组合式 API 集成
- 上传/下载支持

## 基本用法

```ts
import { un } from '@uni-helper/uni-network'

// GET 请求
un('/user/123')

// POST 请求
un({
  method: 'POST',
  url: '/user/123',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
})
```

## 请求别名

```ts
import { un } from '@uni-helper/uni-network'

// HTTP 动词
un.get('/users')
un.post('/users', { name: 'John' })
un.put('/users/1', { name: 'Jane' })
un.patch('/users/1', { age: 30 })
un.delete('/users/1')

// 上传/下载
un.upload({
  url: '/upload',
  filePath: tempFilePath,
  name: 'file',
})

un.download({
  url: '/files/report.pdf',
})
```

## 创建实例

```ts
import { createUniNetwork } from '@uni-helper/uni-network'

const http = createUniNetwork({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 使用实例
http.get('/users')
```

## 拦截器

```ts
import { un } from '@uni-helper/uni-network'

// 请求拦截器
un.interceptors.request.use(
  (config) => {
    // 添加认证令牌
    const token = uni.getStorageSync('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
un.interceptors.response.use(
  (response) => {
    // 转换响应数据
    return response.data
  },
  (error) => {
    // 全局错误处理
    if (error.statusCode === 401) {
      uni.redirectTo({ url: '/pages/login/index' })
    }
    return Promise.reject(error)
  }
)
```

## 配置

```ts
interface UniNetworkConfig {
  // URL
  url?: string
  // 基础 URL
  baseURL?: string
  // 请求方法
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | ...
  // 请求头
  headers?: Record<string, string>
  // 请求数据
  data?: any
  // 查询参数
  params?: Record<string, any>
  // 超时时间（毫秒）
  timeout?: number
  // 响应类型
  responseType?: 'text' | 'arraybuffer'
  // 数据类型
  dataType?: 'json' | 'string'
  // 启用 http2
  enableHttp2?: boolean
  // 启用 quic
  enableQuic?: boolean
  // 启用缓存
  enableCache?: boolean
  // SSL 验证
  sslVerify?: boolean
}
```

## 请求取消

```ts
import { un } from '@uni-helper/uni-network'

const controller = new AbortController()

un.get('/long-request', {
  signal: controller.signal,
})

// 5 秒后取消
setTimeout(() => {
  controller.abort()
}, 5000)
```

## 错误处理

```ts
import { un, UniNetworkError } from '@uni-helper/uni-network'

try {
  const response = await un.get('/users')
} catch (error) {
  if (error instanceof UniNetworkError) {
    console.log('请求失败:', error.message)
    console.log('状态码:', error.statusCode)
  }
}
```

## 组合式 API

```ts
import { useUniNetwork } from '@uni-helper/uni-network'

const { data, error, loading, execute } = useUniNetwork({
  url: '/users',
  method: 'GET',
})

// 手动执行
await execute()
```

## TypeScript 支持

```ts
import { un } from '@uni-helper/uni-network'

interface User {
  id: number
  name: string
  email: string
}

// 类型化的响应
const { data } = await un.get<User>('/users/1')
console.log(data.name) // 类型安全访问
```

<!--
Source references:
- https://github.com/uni-helper/uni-network
- https://uni-helper.js.org/uni-network
-->
