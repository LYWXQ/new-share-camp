---
name: UI 反馈
description: Toast、模态框、加载和动作面板 API。在使用 uni-app 的提示、弹窗、加载等 UI 反馈相关 API 时调用此技能。
---

# UI 反馈

## Toast 消息

### uni.showToast

显示成功/错误消息。

```javascript
// 成功 toast
uni.showToast({
  title: '成功！',
  icon: 'success',
  duration: 2000,
  mask: false
})

// 加载 toast
uni.showToast({
  title: '加载中...',
  icon: 'loading',
  duration: 10000
})

// 仅文字（无图标）
uni.showToast({
  title: '请稍候',
  icon: 'none',
  duration: 2000
})

// 错误 toast
uni.showToast({
  title: '失败！',
  icon: 'error'
})
```

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| title | String | 必填 | 消息文本 |
| icon | String | success | success/loading/none/error |
| duration | Number | 1500 | 显示时长（毫秒） |
| mask | Boolean | false | 显示期间阻止触摸 |
| position | String | | top/center/bottom（App） |

### uni.hideToast

```javascript
uni.hideToast()
```

## 加载

### uni.showLoading

```javascript
uni.showLoading({
  title: '加载中...',
  mask: true // 阻止交互
})

// 操作完成后隐藏
setTimeout(() => {
  uni.hideLoading()
}, 2000)
```

### uni.hideLoading

```javascript
uni.hideLoading()
```

## 模态框

### uni.showModal

警告和确认对话框。

```javascript
// 警告（单按钮）
uni.showModal({
  title: '提示',
  content: '操作已完成',
  showCancel: false
})

// 确认（双按钮）
uni.showModal({
  title: '确认',
  content: '确定吗？',
  cancelText: '取消',
  cancelColor: '#999',
  confirmText: '确认',
  confirmColor: '#007AFF',
  success: (res) => {
    if (res.confirm) {
      console.log('用户确认')
    } else if (res.cancel) {
      console.log('用户取消')
    }
  }
})

// 可编辑模态框
uni.showModal({
  title: '输入',
  content: '请输入您的姓名',
  editable: true,
  placeholderText: '姓名',
  success: (res) => {
    if (res.confirm) {
      console.log('输入：', res.content)
    }
  }
})
```

## 动作面板

### uni.showActionSheet

底部动作菜单。

```javascript
uni.showActionSheet({
  itemList: ['拍照', '从相册选择', '取消'],
  itemColor: '#000000',
  success: (res) => {
    // res.tapIndex: 0, 1, 2...
    console.log('选择：', res.tapIndex)
    switch (res.tapIndex) {
      case 0:
        this.takePhoto()
        break
      case 1:
        this.chooseFromAlbum()
        break
    }
  },
  fail: (err) => {
    console.log('取消')
  }
})
```

## 下拉刷新

### 在 pages.json 中启用

```json
{
  "pages": [{
    "path": "pages/index/index",
    "style": {
      "enablePullDownRefresh": true,
      "backgroundTextStyle": "dark"
    }
  }]
}
```

### 在页面中处理

```javascript
export default {
  onPullDownRefresh() {
    console.log('触发下拉刷新')
    this.refreshData().finally(() => {
      uni.stopPullDownRefresh()
    })
  }
}
```

### 编程控制

```javascript
// 开始下拉刷新
uni.startPullDownRefresh()

// 停止下拉刷新
uni.stopPullDownRefresh()
```

## 导航栏加载

```javascript
// 在导航栏显示加载
uni.showNavigationBarLoading()

// 隐藏加载
uni.hideNavigationBarLoading()
```

## TabBar 操作

### 显示/隐藏 TabBar

```javascript
// 隐藏 tabBar
uni.hideTabBar({
  animation: true
})

// 显示 tabBar
uni.showTabBar({
  animation: true
})
```

### 设置 TabBar 样式

```javascript
uni.setTabBarStyle({
  color: '#999',
  selectedColor: '#007AFF',
  backgroundColor: '#fff',
  borderStyle: 'black'
})
```

### 设置 TabBar 项

```javascript
uni.setTabBarItem({
  index: 0,
  text: '首页',
  iconPath: '/static/home.png',
  selectedIconPath: '/static/home-active.png'
})
```

### 添加/移除 TabBar 红点

```javascript
// 显示红点
uni.showTabBarRedDot({
  index: 2 // Tab 索引
})

// 隐藏红点
uni.hideTabBarRedDot({
  index: 2
})

// 设置红点文字
uni.setTabBarBadge({
  index: 2,
  text: '5'
})

// 移除红点文字
uni.removeTabBarBadge({
  index: 2
})
```

## 预览图片

```javascript
uni.previewImage({
  current: 'https://example.com/1.jpg', // 当前图片
  urls: [
    'https://example.com/1.jpg',
    'https://example.com/2.jpg',
    'https://example.com/3.jpg'
  ],
  indicator: 'default', // default/number/none
  loop: false,
  longPressActions: {
    itemList: ['保存图片', '分享'],
    success: (data) => {
      console.log('长按：', data.tapIndex)
    }
  }
})
```

## 保存图片到相册

```javascript
uni.saveImageToPhotosAlbum({
  filePath: 'temp://path/to/image.jpg',
  success: () => {
    uni.showToast({ title: '已保存' })
  }
})
```

## 最佳实践

### Toast 助手

```javascript
const toast = {
  success(message, duration = 2000) {
    uni.showToast({ title: message, icon: 'success', duration })
  },
  error(message, duration = 2000) {
    uni.showToast({ title: message, icon: 'error', duration })
  },
  loading(message = '加载中...') {
    uni.showLoading({ title: message, mask: true })
  },
  hide() {
    uni.hideLoading()
    uni.hideToast()
  },
  text(message, duration = 2000) {
    uni.showToast({ title: message, icon: 'none', duration })
  }
}

// 使用
toast.loading()
fetchData()
  .then(() => toast.success('加载完成'))
  .catch(() => toast.error('加载失败'))
  .finally(() => toast.hide())
```

### 模态框助手

```javascript
const modal = {
  confirm(title, content) {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        success: (res) => resolve(res.confirm)
      })
    })
  },

  alert(title, content) {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        showCancel: false,
        success: () => resolve()
      })
    })
  },

  action(items) {
    return new Promise((resolve, reject) => {
      uni.showActionSheet({
        itemList: items,
        success: (res) => resolve(res.tapIndex),
        fail: reject
      })
    })
  }
}

// 使用
async function deleteItem(id) {
  const confirmed = await modal.confirm('删除', '确定吗？')
  if (confirmed) {
    await api.delete(id)
    toast.success('已删除')
  }
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/ui/prompt.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/ui/navigationbar.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/ui/tabbar.md
-->
