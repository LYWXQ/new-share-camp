---
name: 系统信息
description: 设备信息、系统信息和环境检测 API。在获取 uni-app 应用运行的设备信息、系统状态或进行平台检测时调用此技能。
---

# 系统信息

## uni.getSystemInfo / getSystemInfoSync

获取设备和系统信息。

```javascript
// 同步（更快，推荐）
const info = uni.getSystemInfoSync()
console.log(info)

// 异步
uni.getSystemInfo({
  success: (res) => {
    console.log(res)
  }
})

// Promise
uni.getSystemInfo().then(res => {
  console.log(res)
})
```

### 系统信息属性

| 属性 | 类型 | 描述 |
|------|------|------|
| brand | String | 设备品牌 |
| model | String | 设备型号 |
| pixelRatio | Number | 设备像素比 |
| screenWidth | Number | 屏幕宽度（px） |
| screenHeight | Number | 屏幕高度（px） |
| windowWidth | Number | 窗口宽度（px） |
| windowHeight | Number | 窗口高度（px） |
| statusBarHeight | Number | 状态栏高度（px） |
| language | String | 语言 |
| system | String | 操作系统版本 |
| version | String | 微信/运行时版本 |
| platform | String | 平台：ios/android/windows/mac/devtools |
| SDKVersion | String | 客户端基础库版本 |
| appId | String | 应用 ID（DCloud） |
| appName | String | 应用名称 |
| appVersion | String | 应用版本 |
| appCodeName | String | 应用代码名 |
| uniPlatform | String | uni-app 平台 |
| uniCompileVersion | String | 编译版本 |
| uniRuntimeVersion | String | 运行时版本 |
| deviceId | String | 设备 ID |
| deviceBrand | String | 设备品牌 |
| deviceModel | String | 设备型号 |
| deviceType | String | 设备类型：phone/pad |
| osName | String | 操作系统名称 |
| osVersion | String | 操作系统版本 |
| osLanguage | String | 操作系统语言 |
| osTheme | String | 操作系统主题：light/dark |
| batteryLevel | Number | 电池电量（0-100） |

## uni.getAppBaseInfo

获取应用基础信息。

```javascript
const info = uni.getAppBaseInfo()
// 返回：appId, appName, appVersion, appVersionCode 等
```

## uni.getDeviceInfo

获取设备硬件信息。

```javascript
const info = uni.getDeviceInfo()
// 返回：brand, model, deviceId, deviceBrand, deviceModel, deviceType
```

## uni.getWindowInfo

获取窗口信息。

```javascript
const info = uni.getWindowInfo()
// 返回：pixelRatio, screenWidth, screenHeight, windowWidth, windowHeight,
//       statusBarHeight, safeArea, screenTop
```

## 安全区域

处理刘海屏设备和安全区域。

```javascript
const info = uni.getSystemInfoSync()

// 安全区域信息
const safeArea = info.safeArea
console.log(safeArea) // { top, left, right, bottom, width, height }

// 检查设备是否有刘海（顶部不安全区域）
const hasNotch = info.safeAreaInsets && info.safeAreaInsets.top > 0
```

### 安全区域 CSS 变量（App/H5）

```css
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}
```

## 网络状态

### uni.getNetworkType

```javascript
uni.getNetworkType({
  success: (res) => {
    // res.networkType: wifi/2g/3g/4g/5g/unknown/none
    console.log('网络：', res.networkType)
  }
})
```

### uni.onNetworkStatusChange

```javascript
// 监听网络变化
uni.onNetworkStatusChange((res) => {
  console.log('网络类型：', res.networkType)
  console.log('是否连接：', res.isConnected)
})

// 移除监听
uni.offNetworkStatusChange(callback)
```

## 电池信息

### uni.getBatteryInfo

```javascript
uni.getBatteryInfo({
  success: (res) => {
    console.log('电量：', res.level) // 0-100
    console.log('是否充电：', res.isCharging)
  }
})
```

## 设备方向

### uni.onDeviceMotionChange

```javascript
uni.startDeviceMotionListening({
  interval: 'normal', // game/ui/normal
  success: () => {
    uni.onDeviceMotionChange((res) => {
      console.log('Alpha：', res.alpha) // 0-360
      console.log('Beta：', res.beta)   // -180 到 180
      console.log('Gamma：', res.gamma) // -90 到 90
    })
  }
})

// 停止监听
uni.stopDeviceMotionListening()
```

### 屏幕方向

```javascript
// 获取当前方向
const info = uni.getSystemInfoSync()
const isLandscape = info.screenWidth > info.screenHeight

// 锁定方向（仅 App）
plus.screen.lockOrientation('portrait-primary')
// 选项：portrait-primary/portrait-secondary/landscape-primary/landscape-secondary
```

## 屏幕亮度

```javascript
// 设置亮度（0-1）
uni.setScreenBrightness({
  value: 0.8
})

// 获取亮度
uni.getScreenBrightness({
  success: (res) => {
    console.log('亮度：', res.value)
  }
})

// 保持屏幕常亮
uni.setKeepScreenOn({
  keepScreenOn: true
})
```

## 振动

```javascript
// 短振动（15ms）
uni.vibrateShort()

// 长振动（400ms）
uni.vibrateLong()

// 模式振动（仅 App）
uni.vibrateLong() // 或自定义模式
```

## 剪贴板

```javascript
// 设置剪贴板
uni.setClipboardData({
  data: '要复制的文本',
  success: () => {
    uni.showToast({ title: '已复制' })
  }
})

// 获取剪贴板
uni.getClipboardData({
  success: (res) => {
    console.log('剪贴板：', res.data)
  }
})
```

## 拨打电话

```javascript
uni.makePhoneCall({
  phoneNumber: '13800138000'
})
```

## 扫码

```javascript
uni.scanCode({
  onlyFromCamera: false, // 允许从相册选择
  scanType: ['qrCode', 'barCode'], // 扫码类型
  success: (res) => {
    console.log('结果：', res.result)
    console.log('类型：', res.scanType)
    console.log('字符集：', res.charSet)
  }
})
```

## 平台检测

```javascript
const info = uni.getSystemInfoSync()

// 平台检查
const isIOS = info.platform === 'ios'
const isAndroid = info.platform === 'android'
const isWindows = info.platform === 'windows'
const isMac = info.platform === 'mac'
const isDevtools = info.platform === 'devtools'

// App 平台检查
const isApp = info.uniPlatform === 'app'
const isH5 = info.uniPlatform === 'web'
const isWeixinMP = info.uniPlatform === 'mp-weixin'

// 安全区域计算
const safeAreaTop = info.statusBarHeight + (isApp ? 44 : 0) // 导航栏 44px
```

## 存储信息

```javascript
uni.getStorageInfo({
  success: (res) => {
    console.log('键：', res.keys)
    console.log('当前大小：', res.currentSize)
    console.log('限制大小：', res.limitSize)
  }
})
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/system/info.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/system/network.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/system/phone.md
-->
