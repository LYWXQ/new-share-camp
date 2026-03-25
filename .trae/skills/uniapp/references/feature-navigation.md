---
name: 导航
description: 导航、路由和页面导航组件。在使用 uni-app 的 navigator 组件或 uni.navigateTo、uni.redirectTo 等导航 API 时调用此技能。
---

# 导航

## navigator

页面导航组件。

```vue
<template>
  <!-- 基础导航 -->
  <navigator url="/pages/detail/detail" hover-class="navigator-hover">
    前往详情
  </navigator>

  <!-- 在新页面打开 -->
  <navigator url="/pages/detail/detail" open-type="navigate">
    导航（默认）
  </navigator>

  <!-- 重定向（无返回按钮） -->
  <navigator url="/pages/login/login" open-type="redirect">
    登录（重定向）
  </navigator>

  <!-- 切换到 tab 页面 -->
  <navigator url="/pages/index/index" open-type="switchTab">
    前往首页
  </navigator>

  <!-- 重启应用 -->
  <navigator url="/pages/start/start" open-type="reLaunch">
    重新启动
  </navigator>

  <!-- 返回 -->
  <navigator open-type="navigateBack" :delta="1">
    返回
  </navigator>

  <!-- 退出应用（小程序） -->
  <navigator open-type="exit" target="miniProgram">
    退出
  </navigator>
</template>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| url | String | | 目标页面路径 |
| open-type | String | navigate | navigate/redirect/switchTab/reLaunch/navigateBack/exit |
| delta | Number | 1 | open-type 为 navigateBack 时的返回层级 |
| hover-class | String | navigator-hover | 悬停状态类 |
| hover-stop-propagation | Boolean | false | 阻止悬停冒泡 |
| target | String | self | self/miniProgram（仅小程序） |

## 编程式导航

### uni.navigateTo

导航到新页面。

```javascript
// 基础导航
uni.navigateTo({
  url: '/pages/detail/detail'
})

// 带查询参数
uni.navigateTo({
  url: '/pages/detail/detail?id=123&name=test'
})

// 带事件（仅 Vue 2）
uni.navigateTo({
  url: '/pages/detail/detail',
  events: {
    acceptDataFromOpenedPage(data) {
      console.log(data)
    }
  },
  success(res) {
    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
  }
})
```

### uni.redirectTo

重定向到新页面（关闭当前页面）。

```javascript
uni.redirectTo({
  url: '/pages/login/login'
})
```

### uni.reLaunch

重启应用到指定页面。

```javascript
uni.reLaunch({
  url: '/pages/index/index'
})
```

### uni.switchTab

切换到 tabBar 页面。

```javascript
uni.switchTab({
  url: '/pages/home/home'
})
```

### uni.navigateBack

返回上一页。

```javascript
// 返回一页
uni.navigateBack()

// 返回多页
uni.navigateBack({
  delta: 2
})

// 带动画（仅 App）
uni.navigateBack({
  delta: 1,
  animationType: 'pop-out',
  animationDuration: 300
})
```

### uni.preloadPage

预加载页面以加快导航（仅 App）。

```javascript
uni.preloadPage({
  url: '/pages/detail/detail'
})
```

## 获取页面信息

### getCurrentPages

获取当前页面栈。

```javascript
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
console.log(currentPage.route) // 当前页面路径
```

### getApp

获取应用实例。

```javascript
const app = getApp()
console.log(app.globalData)
```

## 页面事件通道（Vue 2）

使用事件通道在页面间通信。

```javascript
// 页面 A：打开页面 B
uni.navigateTo({
  url: '/pages/pageB/pageB',
  success(res) {
    // 监听页面 B 的事件
    res.eventChannel.on('acceptDataFromPageB', (data) => {
      console.log(data)
    })
    // 发送数据到页面 B
    res.eventChannel.emit('acceptDataFromPageA', { data: 'hello' })
  }
})

// 页面 B：接收和发送数据
export default {
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    // 监听页面 A 的事件
    eventChannel.on('acceptDataFromPageA', (data) => {
      console.log(data)
    })
    // 发送数据回页面 A
    eventChannel.emit('acceptDataFromPageB', { data: 'world' })
  }
}
```

## 导航栏

### 自定义导航栏

在 `pages.json` 中配置：

```json
{
  "pages": [{
    "path": "pages/index/index",
    "style": {
      "navigationStyle": "custom"
    }
  }]
}
```

### uni.setNavigationBarTitle

```javascript
uni.setNavigationBarTitle({
  title: '新标题'
})
```

### uni.setNavigationBarColor

```javascript
uni.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#000000',
  animation: {
    duration: 400,
    timingFunc: 'easeIn'
  }
})
```

### uni.showNavigationBarLoading

```javascript
uni.showNavigationBarLoading()
// ...加载操作
uni.hideNavigationBarLoading()
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/navigator.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/router.md
-->
