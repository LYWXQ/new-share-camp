---
name: uni-promises
description: uni-app API 的 Promise 封装 - 将基于回调的 API 转换为基于 Promise 的 API，做什么：为 uni-app 的回调式 API 提供 Promise 封装，支持 async/await；何时调用：当用户需要将 uni-app 的回调式 API（如 uni.request、uni.showModal、uni.getStorage 等）转换为 Promise 形式以更好地使用 async/await 时调用
---

# uni-promises

uni-app 基于回调的 API 的 Promise 封装。将 uni-app API 转换为返回 Promise，以提供更好的 async/await 支持。

## 安装

```bash
npm i @uni-helper/uni-promises
```

## 用法

不再使用回调：

```ts
// 原始回调风格
uni.request({
  url: 'https://api.example.com',
  success: (res) => {
    console.log(res.data)
  },
  fail: (err) => {
    console.error(err)
  },
})
```

使用 Promise：

```ts
import { request } from '@uni-helper/uni-promises'

// Promise 风格
const res = await request({
  url: 'https://api.example.com',
})
console.log(res.data)
```

## 可用 API

大多数 uni-app API 都被封装了：

### 网络
- `request` - HTTP 请求
- `uploadFile` - 文件上传
- `downloadFile` - 文件下载
- `connectSocket` - WebSocket

### 存储
- `setStorage` - 设置存储
- `getStorage` - 获取存储
- `removeStorage` - 移除存储
- `clearStorage` - 清除所有存储
- `getStorageInfo` - 存储信息

### 媒体
- `chooseImage` - 选择图片
- `chooseVideo` - 选择视频
- `chooseMedia` - 选择媒体
- `previewImage` - 预览图片
- `saveImageToPhotosAlbum` - 保存图片
- `compressImage` - 压缩图片

### 文件
- `saveFile` - 保存文件
- `getFileInfo` - 文件信息
- `getSavedFileList` - 已保存文件列表
- `removeSavedFile` - 移除已保存文件
- `openDocument` - 打开文档

### 位置
- `getLocation` - 获取位置
- `chooseLocation` - 选择位置
- `openLocation` - 打开位置

### 设备
- `getSystemInfo` - 系统信息
- `getNetworkType` - 网络类型
- `scanCode` - 扫码
- `setClipboardData` - 复制到剪贴板
- `getClipboardData` - 获取剪贴板

### UI
- `showToast` - 显示提示
- `showModal` - 显示模态框
- `showActionSheet` - 显示操作菜单
- `showLoading` - 显示加载
- `hideLoading` - 隐藏加载
- `showNavigationBarLoading` - 导航栏加载
- `hideNavigationBarLoading` - 隐藏导航栏加载
- `setNavigationBarTitle` - 设置导航栏标题
- `setNavigationBarColor` - 设置导航栏颜色
- `pageScrollTo` - 滚动到位置

### 导航
- `navigateTo` - 导航到页面
- `redirectTo` - 重定向到页面
- `reLaunch` - 重启应用
- `switchTab` - 切换标签页
- `navigateBack` - 返回

### 登录
- `login` - 用户登录
- `checkSession` - 检查会话
- `getUserProfile` - 获取用户资料
- `getUserInfo` - 获取用户信息

### 支付
- `requestPayment` - 发起支付

## 示例用法

```ts
import {
  showModal,
  showToast,
  getStorage,
  navigateTo,
  getSystemInfo,
  chooseImage,
  uploadFile,
} from '@uni-helper/uni-promises'

async function handleUserAction() {
  // 显示确认
  const { confirm } = await showModal({
    title: '确认',
    content: '你确定吗？',
  })

  if (!confirm) return

  try {
    // 获取缓存数据
    const { data: token } = await getStorage({ key: 'token' })

    // 获取系统信息
    const systemInfo = await getSystemInfo()
    console.log('平台:', systemInfo.platform)

    // 选择图片
    const { tempFilePaths } = await chooseImage({
      count: 1,
      sizeType: ['compressed'],
    })

    // 上传文件
    const uploadRes = await uploadFile({
      url: 'https://api.example.com/upload',
      filePath: tempFilePaths[0],
      name: 'file',
    })

    await showToast({
      title: '成功!',
      icon: 'success',
    })

    // 导航
    await navigateTo({
      url: '/pages/success/index',
    })
  } catch (error) {
    await showToast({
      title: error.message || '失败',
      icon: 'error',
    })
  }
}
```

## 错误处理

所有封装的 API 都使用标准 Error 对象 reject：

```ts
import { request } from '@uni-helper/uni-promises'

try {
  const res = await request({ url: 'https://api.example.com' })
} catch (error) {
  // error.message 包含 fail 回调的消息
  console.error('请求失败:', error.message)
}
```

<!--
Source references:
- https://github.com/uni-helper/uni-promises
- https://uni-helper.js.org/uni-promises
-->
