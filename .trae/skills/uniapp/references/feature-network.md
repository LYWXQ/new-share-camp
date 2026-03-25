---
name: 网络请求
description: HTTP 请求、文件上传/下载和 WebSocket。在使用 uni-app 进行网络请求、文件传输或 WebSocket 通信时调用此技能。
---

# 网络请求

## uni.request

向后端 API 发起 HTTP 请求。

```javascript
// GET 请求
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: { id: 123 },
  header: {
    'content-type': 'application/json',
    'Authorization': 'Bearer token'
  },
  timeout: 30000,
  success: (res) => {
    console.log(res.data)
  },
  fail: (err) => {
    console.error(err)
  },
  complete: () => {
    console.log('请求完成')
  }
})

// POST 请求（JSON）
uni.request({
  url: 'https://api.example.com/submit',
  method: 'POST',
  data: {
    name: 'John',
    age: 30
  },
  header: {
    'content-type': 'application/json'
  },
  success: (res) => {
    if (res.statusCode === 200) {
      console.log('成功：', res.data)
    }
  }
})

// 使用 Promise
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET'
}).then(res => {
  console.log(res.data)
}).catch(err => {
  console.error(err)
})

// Async/await
async function fetchData() {
  try {
    const res = await uni.request({
      url: 'https://api.example.com/data'
    })
    return res.data
  } catch (err) {
    console.error('获取失败：', err)
    throw err
  }
}
```

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | String | 是 | 请求 URL |
| data | Object/String/Array/ArrayBuffer | 否 | 请求数据 |
| header | Object | 否 | 请求头 |
| method | String | 否 | HTTP 方法（默认：GET） |
| timeout | Number | 否 | 超时时间（毫秒，默认：60000） |
| dataType | String | 否 | 响应数据类型（默认：json） |
| responseType | String | 否 | 响应类型（默认：text） |
| sslVerify | Boolean | 否 | 验证 SSL 证书（默认：true） |

**响应对象：**

```javascript
{
  data: Object | String | ArrayBuffer,  // 响应数据
  statusCode: Number,                   // HTTP 状态码
  header: Object,                       // 响应头
  cookies: Array                        // 响应 cookies
}
```

## uni.uploadFile

上传文件到服务器。

```javascript
uni.chooseImage({
  count: 1,
  success: (chooseRes) => {
    const tempFilePath = chooseRes.tempFilePaths[0]

    const uploadTask = uni.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: tempFilePath,
      name: 'file',
      formData: {
        user: 'test',
        description: '图片上传'
      },
      header: {
        'Authorization': 'Bearer token'
      },
      success: (res) => {
        console.log('上传成功：', JSON.parse(res.data))
      },
      fail: (err) => {
        console.error('上传失败：', err)
      }
    })

    // 跟踪上传进度
    uploadTask.onProgressUpdate((res) => {
      console.log('进度：', res.progress)
      console.log('已上传字节：', res.totalBytesSent)
      console.log('总字节：', res.totalBytesExpectedToSend)
    })

    // 如需可中止上传
    // uploadTask.abort()
  }
})
```

**上传任务方法：**
- `onProgressUpdate(callback)` - 监听进度更新
- `abort()` - 取消上传
- `offProgressUpdate(callback)` - 移除进度监听

## uni.downloadFile

从服务器下载文件。

```javascript
const downloadTask = uni.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    if (res.statusCode === 200) {
      console.log('下载到：', res.tempFilePath)

      // 保存到本地（仅 App）
      uni.saveFile({
        tempFilePath: res.tempFilePath,
        success: (saveRes) => {
          console.log('保存到：', saveRes.savedFilePath)
        }
      })
    }
  }
})

// 跟踪下载进度
downloadTask.onProgressUpdate((res) => {
  console.log('进度：', res.progress)
})
```

## WebSocket

实时双向通信。

```javascript
// 连接 WebSocket
const socketTask = uni.connectSocket({
  url: 'wss://api.example.com/ws',
  protocols: ['protocol1'],
  header: {
    'Authorization': 'Bearer token'
  },
  success: () => {
    console.log('WebSocket 连接中...')
  }
})

// 监听连接打开
uni.onSocketOpen((res) => {
  console.log('WebSocket 已连接')

  // 发送消息
  uni.sendSocketMessage({
    data: JSON.stringify({
      type: 'message',
      content: 'Hello server'
    })
  })
})

// 监听消息
uni.onSocketMessage((res) => {
  console.log('收到：', res.data)
  const data = JSON.parse(res.data)
  // 处理消息...
})

// 监听错误
uni.onSocketError((err) => {
  console.error('WebSocket 错误：', err)
})

// 监听关闭
uni.onSocketClose((res) => {
  console.log('WebSocket 关闭：', res)
})

// 关闭连接
function closeSocket() {
  uni.closeSocket({
    code: 1000,
    reason: '用户登出',
    success: () => {
      console.log('连接已关闭')
    }
  })
}
```

**Socket 任务方法：**
- `close(options)` - 关闭连接
- `send(options)` - 发送消息
- `onOpen(callback)` - 连接已打开
- `onMessage(callback)` - 收到消息
- `onClose(callback)` - 连接已关闭
- `onError(callback)` - 发生错误

## 请求拦截器

使用 `uni.addInterceptor` 拦截请求。

```javascript
// 添加请求拦截器
uni.addInterceptor('request', {
  invoke(args) {
    // 请求前
    console.log('请求：', args)

    // 添加认证 token
    args.header = args.header || {}
    args.header.Authorization = `Bearer ${getToken()}`

    return args
  },
  success(res) {
    // 成功后
    console.log('响应：', res)
    return res
  },
  fail(err) {
    // 失败后
    console.error('请求失败：', err)
    return err
  },
  complete(res) {
    // 始终执行
    console.log('请求完成')
  }
})

// 移除拦截器
uni.removeInterceptor('request')
```

## 域名配置

### 小程序

在小程序开发者控制台配置请求域名：
- `request` 域名：用于 `uni.request`
- `uploadFile` 域名：用于 `uni.uploadFile`
- `downloadFile` 域名：用于 `uni.downloadFile`
- `websocket` 域名：用于 `uni.connectSocket`

### H5

H5 使用浏览器的同源策略。在服务器上配置 CORS 或在开发时使用代理。

```javascript
// vite.config.js 代理配置
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

## 最佳实践

```javascript
// 创建请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 处理未授权
          uni.redirectTo({ url: '/pages/login/login' })
          reject(new Error('未授权'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: reject
    })
  })
}

// 使用
const api = {
  getUser: () => request({ url: '/user' }),
  updateUser: (data) => request({ url: '/user', method: 'PUT', data })
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/request/request.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/request/network-file.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/request/websocket.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/interceptor.md
-->
