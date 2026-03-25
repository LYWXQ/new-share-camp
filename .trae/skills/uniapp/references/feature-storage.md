---
name: 存储
description: 本地数据存储和缓存 API。在使用 uni-app 的本地存储、文件系统或缓存功能时调用此技能。
---

# 存储

## 同步存储（推荐用于小数据）

### uni.setStorageSync

同步存储数据。

```javascript
// 存储简单值
uni.setStorageSync('username', 'John')

// 存储对象
uni.setStorageSync('userInfo', {
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

// 存储数组
uni.setStorageSync('tags', ['vue', 'uniapp', 'javascript'])
```

### uni.getStorageSync

同步获取数据。

```javascript
// 获取简单值
const username = uni.getStorageSync('username')
console.log(username) // 'John'

// 获取对象
const userInfo = uni.getStorageSync('userInfo')
console.log(userInfo.name) // 'John'

// 检查是否存在
const value = uni.getStorageSync('nonexistent')
console.log(value) // ''（不存在时返回空字符串）
```

### uni.removeStorageSync

移除指定键。

```javascript
uni.removeStorageSync('username')
```

### uni.clearStorageSync

清空所有存储。

```javascript
uni.clearStorageSync()
```

## 异步存储（推荐用于大数据）

### uni.setStorage

```javascript
uni.setStorage({
  key: 'userData',
  data: {
    id: 123,
    preferences: { theme: 'dark', language: 'zh' }
  },
  success: () => {
    console.log('存储已保存')
  },
  fail: (err) => {
    console.error('保存失败：', err)
  }
})

// Promise 风格
uni.setStorage({
  key: 'config',
  data: { debug: true }
}).then(() => {
  console.log('配置已保存')
})
```

### uni.getStorage

```javascript
uni.getStorage({
  key: 'userData',
  success: (res) => {
    console.log('数据：', res.data)
  },
  fail: (err) => {
    console.log('键不存在')
  }
})

// Promise 风格
uni.getStorage({ key: 'userData' })
  .then(res => console.log(res.data))
  .catch(() => console.log('不存在'))
```

### uni.removeStorage

```javascript
uni.removeStorage({
  key: 'tempData',
  success: () => {
    console.log('移除成功')
  }
})
```

### uni.getStorageInfo

获取存储信息。

```javascript
uni.getStorageInfo({
  success: (res) => {
    console.log('键：', res.keys)
    console.log('当前大小：', res.currentSize, 'KB')
    console.log('限制大小：', res.limitSize, 'KB')
  }
})
```

## 存储限制

| 平台 | 限制 |
|------|------|
| 小程序 | 10 MB（单个）/ 200+ MB 总计 |
| App | 无硬性限制（取决于设备） |
| H5 | ~5-10 MB（取决于浏览器） |

## 最佳实践

### 数据持久化助手

```javascript
const storage = {
  // 设置带过期时间（天）
  setWithExpiry(key, value, days) {
    const item = {
      value,
      expiry: Date.now() + days * 24 * 60 * 60 * 1000
    }
    uni.setStorageSync(key, item)
  },

  // 获取并检查过期
  getWithExpiry(key) {
    const item = uni.getStorageSync(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      uni.removeStorageSync(key)
      return null
    }
    return item.value
  },

  // 安全获取带默认值
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (e) {
      return defaultValue
    }
  },

  // 批量操作
  setBatch(data) {
    Object.entries(data).forEach(([key, value]) => {
      uni.setStorageSync(key, value)
    })
  },

  clear() {
    uni.clearStorageSync()
  }
}

// 使用
storage.setWithExpiry('token', 'abc123', 7) // 7 天后过期
const token = storage.getWithExpiry('token')
```

### 用户会话管理

```javascript
const session = {
  setToken(token) {
    uni.setStorageSync('access_token', token)
  },

  getToken() {
    return uni.getStorageSync('access_token')
  },

  clearToken() {
    uni.removeStorageSync('access_token')
  },

  setUserInfo(info) {
    uni.setStorageSync('user_info', info)
  },

  getUserInfo() {
    return uni.getStorageSync('user_info')
  },

  isLoggedIn() {
    return !!this.getToken()
  },

  clear() {
    this.clearToken()
    uni.removeStorageSync('user_info')
  }
}
```

## 文件存储（仅 App）

### 本地文件系统

```javascript
// 获取文件系统管理器
const fs = uni.getFileSystemManager()

// 写入文件
fs.writeFile({
  filePath: `${uni.env.USER_DATA_PATH}/data.json`,
  data: JSON.stringify({ name: 'test' }),
  encoding: 'utf8',
  success: () => console.log('文件已写入')
})

// 读取文件
fs.readFile({
  filePath: `${uni.env.USER_DATA_PATH}/data.json`,
  encoding: 'utf8',
  success: (res) => {
    const data = JSON.parse(res.data)
    console.log(data)
  }
})

// 检查文件是否存在
fs.access({
  path: `${uni.env.USER_DATA_PATH}/data.json`,
  success: () => console.log('文件存在'),
  fail: () => console.log('文件不存在')
})
```

## 存储对比

| 方法 | 数据类型 | 大小限制 | 异步 | 使用场景 |
|------|----------|----------|------|----------|
| StorageSync | 任意 | ~10MB | 否 | 小配置数据 |
| Storage | 任意 | ~10MB | 是 | 大数据对象 |
| 文件系统 | 二进制/文本 | 大 | 是 | 文件、图片 |

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/storage/storage.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/file/file.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/file/getFileSystemManager.md
-->
