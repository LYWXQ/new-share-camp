---
name: 文件操作
description: 文件系统操作、图片/视频选择和文件管理。在使用 uni-app 选择图片视频、操作文件系统或管理文件时调用此技能。
---

# 文件操作

## 图片选择

### uni.chooseImage

从相册或相机选择图片。

```javascript
// 从相册选择
uni.chooseImage({
  count: 9, // 最多 9 张
  sizeType: ['original', 'compressed'],
  sourceType: ['album'],
  success: (res) => {
    console.log('已选择：', res.tempFilePaths)
    // tempFilePaths: ['blob:xxx', 'blob:xxx']
    // tempFiles: [{ path, size }]
  }
})

// 拍照
uni.chooseImage({
  count: 1,
  sourceType: ['camera'],
  success: (res) => {
    const tempPath = res.tempFilePaths[0]
    this.uploadImage(tempPath)
  }
})

// 相册和相机
uni.chooseImage({
  count: 5,
  sizeType: ['compressed'], // 仅压缩
  sourceType: ['album', 'camera'],
  success: (res) => {
    res.tempFilePaths.forEach(path => {
      this.previewImage(path)
    })
  }
})
```

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| count | Number | 9 | 最大图片数量 |
| sizeType | Array | ['original', 'compressed'] | original/compressed |
| sourceType | Array | ['album', 'camera'] | album/camera |

## 视频选择

### uni.chooseVideo

选择或录制视频。

```javascript
uni.chooseVideo({
  sourceType: ['album', 'camera'],
  compressed: true,
  maxDuration: 60,
  camera: 'back', // front/back
  success: (res) => {
    console.log('路径：', res.tempFilePath)
    console.log('时长：', res.duration) // 秒
    console.log('大小：', res.size) // 字节
    console.log('高度：', res.height)
    console.log('宽度：', res.width)
  }
})
```

### uni.chooseMedia（微信/QQ）

选择混合媒体类型。

```javascript
uni.chooseMedia({
  count: 9,
  mediaType: ['image', 'video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  camera: 'back',
  success: (res) => {
    console.log(res.tempFiles)
  }
})
```

## 文件选择

### uni.chooseFile

选择任意文件类型。

```javascript
uni.chooseFile({
  count: 1,
  type: 'all', // all/video/image/file
  extension: ['.pdf', '.doc', '.docx'], // 按扩展名过滤
  success: (res) => {
    console.log(res.tempFilePaths)
    console.log(res.tempFiles)
  }
})
```

## 文件系统操作（App）

### 获取文件系统管理器

```javascript
const fs = uni.getFileSystemManager()
```

### 读取文件

```javascript
// 作为文本读取
fs.readFile({
  filePath: `${uni.env.USER_DATA_PATH}/data.txt`,
  encoding: 'utf8',
  success: (res) => {
    console.log(res.data)
  }
})

// 作为二进制读取
fs.readFile({
  filePath: tempFilePath,
  encoding: 'binary',
  success: (res) => {
    console.log(res.data)
  }
})
```

### 写入文件

```javascript
fs.writeFile({
  filePath: `${uni.env.USER_DATA_PATH}/config.json`,
  data: JSON.stringify({ theme: 'dark' }),
  encoding: 'utf8',
  success: () => {
    console.log('文件已写入')
  }
})
```

### 追加到文件

```javascript
fs.appendFile({
  filePath: `${uni.env.USER_DATA_PATH}/log.txt`,
  data: '\n新日志条目',
  encoding: 'utf8',
  success: () => {
    console.log('已追加')
  }
})
```

### 删除文件

```javascript
fs.unlink({
  filePath: `${uni.env.USER_DATA_PATH}/temp.txt`,
  success: () => {
    console.log('文件已删除')
  }
})
```

### 检查文件是否存在

```javascript
fs.access({
  path: `${uni.env.USER_DATA_PATH}/data.json`,
  success: () => {
    console.log('文件存在')
  },
  fail: () => {
    console.log('文件不存在')
  }
})
```

### 创建目录

```javascript
fs.mkdir({
  dirPath: `${uni.env.USER_DATA_PATH}/downloads`,
  recursive: true, // 创建父目录
  success: () => {
    console.log('目录已创建')
  }
})
```

### 读取目录

```javascript
fs.readdir({
  dirPath: `${uni.env.USER_DATA_PATH}/downloads`,
  success: (res) => {
    console.log('文件：', res.files)
  }
})
```

### 获取文件信息

```javascript
fs.getFileInfo({
  filePath: tempFilePath,
  success: (res) => {
    console.log('大小：', res.size)
    console.log('创建时间：', res.createTime)
    console.log('最后访问：', res.lastAccessedTime)
  }
})
```

## 保存和打开文件

### 保存文件

```javascript
uni.saveFile({
  tempFilePath: res.tempFilePath,
  success: (res) => {
    const savedPath = res.savedFilePath
    console.log('保存到：', savedPath)
  }
})
```

### 获取已保存文件列表

```javascript
uni.getSavedFileList({
  success: (res) => {
    console.log('文件：', res.fileList)
    // [{ filePath, createTime, size }, ...]
  }
})
```

### 获取已保存文件信息

```javascript
uni.getSavedFileInfo({
  filePath: savedFilePath,
  success: (res) => {
    console.log('大小：', res.size)
    console.log('创建时间：', res.createTime)
  }
})
```

### 移除已保存文件

```javascript
uni.removeSavedFile({
  filePath: savedFilePath,
  success: () => {
    console.log('文件已移除')
  }
})
```

### 打开文档

```javascript
uni.openDocument({
  filePath: filePath,
  fileType: 'pdf', // 可选提示
  showMenu: true, // 显示分享菜单（微信）
  success: () => {
    console.log('文档已打开')
  }
})
```

## 图片操作

### 预览图片

```javascript
uni.previewImage({
  current: currentImage, // 当前图片 URL
  urls: imageList, // 所有图片 URL
  indicator: 'default',
  loop: false,
  longPressActions: {
    itemList: ['保存图片', '分享'],
    success: (data) => {
      console.log('选择：', data.tapIndex)
    }
  }
})
```

### 获取图片信息

```javascript
uni.getImageInfo({
  src: imagePath,
  success: (res) => {
    console.log('宽度：', res.width)
    console.log('高度：', res.height)
    console.log('路径：', res.path)
    console.log('方向：', res.orientation)
    console.log('类型：', res.type)
  }
})
```

### 压缩图片

```javascript
uni.compressImage({
  src: originalPath,
  quality: 80, // 0-100
  success: (res) => {
    console.log('已压缩：', res.tempFilePath)
  }
})
```

### 保存图片到相册

```javascript
uni.saveImageToPhotosAlbum({
  filePath: tempFilePath,
  success: () => {
    uni.showToast({ title: '已保存到相册' })
  }
})
```

## 视频操作

### 保存视频到相册

```javascript
uni.saveVideoToPhotosAlbum({
  filePath: videoPath,
  success: () => {
    uni.showToast({ title: '视频已保存' })
  }
})
```

### 获取视频信息

```javascript
uni.getVideoInfo({
  src: videoPath,
  success: (res) => {
    console.log('时长：', res.duration)
    console.log('大小：', res.size)
    console.log('比特率：', res.bitrate)
    console.log('帧率：', res.fps)
  }
})
```

## 文件路径参考

| 路径类型 | 示例 | 描述 |
|----------|------|------|
| tempFilePath | `blob:xxx` 或 `_doc/uniapp_temp/xxx` | 临时文件 |
| savedFilePath | `_doc/uniapp_save/xxx` | 已保存文件 |
| USER_DATA_PATH | `_doc/` | 应用数据目录 |

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/media/image.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/media/file.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/file/file.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/file/getFileSystemManager.md
-->
