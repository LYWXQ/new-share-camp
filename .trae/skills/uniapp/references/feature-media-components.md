---
name: 媒体组件
description: 图片、视频、音频和相机组件。在使用 uni-app 的 image、video、camera、live-player、map 等媒体相关组件时调用此技能。
---

# 媒体组件

## image

显示图片，支持多种模式选项。

```vue
<template>
  <!-- 基础用法 -->
  <image src="/static/logo.png" mode="aspectFit" />

  <!-- 带事件处理 -->
  <image
    :src="imageUrl"
    mode="aspectFill"
    :lazy-load="true"
    :show-menu-by-longpress="true"
    @load="onImageLoad"
    @error="onImageError"
  />
</template>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| src | String | | 图片源 URL |
| mode | String | scaleToFill | 显示模式（见下方） |
| lazy-load | Boolean | false | 懒加载图片 |
| show-menu-by-longpress | Boolean | false | 长按显示菜单 |
| webp | Boolean | false | 解析 WebP 格式（Android） |

**模式值：**

| 模式 | 描述 |
|------|------|
| scaleToFill | 填充容器，可能变形 |
| aspectFit | 在容器内完整显示 |
| aspectFill | 覆盖容器，可能裁剪 |
| widthFix | 宽度固定，高度自适应 |
| heightFix | 高度固定，宽度自适应 |
| top / bottom / center / left / right | 对齐到位置 |
| top left / top right / bottom left / bottom right | 角落对齐 |

**事件：**
- `@load` - 图片加载成功
- `@error` - 图片加载失败

## video

视频播放器组件。

```vue
<template>
  <video
    id="myVideo"
    src="https://example.com/video.mp4"
    :controls="true"
    :autoplay="false"
    :loop="false"
    :muted="false"
    initial-time="30"
    :duration="300"
    poster="/static/poster.jpg"
    object-fit="contain"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @timeupdate="onTimeUpdate"
    @fullscreenchange="onFullscreenChange"
  />
</template>

<script>
export default {
  onReady() {
    this.videoContext = uni.createVideoContext('myVideo')
  },
  methods: {
    play() {
      this.videoContext.play()
    },
    pause() {
      this.videoContext.pause()
    },
    seek(time) {
      this.videoContext.seek(time)
    },
    sendDanmu(danmu) {
      this.videoContext.sendDanmu({
        text: danmu.text,
        color: danmu.color
      })
    },
    playbackRate(rate) {
      this.videoContext.playbackRate(rate)
    },
    onFullscreenChange(e) {
      console.log('全屏：', e.detail.fullScreen)
    }
  }
}
</script>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| src | String | | 视频源 URL |
| controls | Boolean | true | 显示控制条 |
| autoplay | Boolean | false | 自动播放 |
| loop | Boolean | false | 循环播放 |
| muted | Boolean | false | 静音 |
| initial-time | Number | 0 | 开始时间（秒） |
| duration | Number | | 总时长（秒） |
| poster | String | | 封面图 URL |
| object-fit | String | contain | contain/cover/fill |
| danmu-list | Array | | 弹幕列表 |
| danmu-btn | Boolean | false | 显示弹幕按钮 |
| enable-danmu | Boolean | false | 启用弹幕 |
| show-center-play-btn | Boolean | true | 显示中间播放按钮 |
| show-play-btn | Boolean | true | 显示播放按钮 |
| show-fullscreen-btn | Boolean | true | 显示全屏按钮 |
| page-gesture | Boolean | false | 启用页面手势 |
| enable-progress-gesture | Boolean | true | 启用进度手势 |

## audio

音频播放器（已弃用，请使用 `uni.getBackgroundAudioManager`）。

```vue
<template>
  <audio
    :src="audioSrc"
    :poster="posterUrl"
    :name="audioName"
    :author="author"
    :controls="true"
    :loop="false"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @timeupdate="onTimeUpdate"
  />
</template>
```

## camera

相机组件，用于拍摄照片/视频。

```vue
<template>
  <camera
    device-position="back"
    flash="auto"
    resolution="high"
    frame-size="large"
    @stop="onCameraStop"
    @error="onCameraError"
    @initdone="onCameraReady"
  />
  <button @click="takePhoto">拍照</button>
  <button @click="startRecord">开始录像</button>
  <button @click="stopRecord">停止录像</button>
</template>

<script>
export default {
  onReady() {
    this.cameraContext = uni.createCameraContext()
  },
  methods: {
    takePhoto() {
      this.cameraContext.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log(res.tempImagePath)
        }
      })
    },
    startRecord() {
      this.cameraContext.startRecord({
        success: () => console.log('开始录像')
      })
    },
    stopRecord() {
      this.cameraContext.stopRecord({
        success: (res) => {
          console.log(res.tempVideoPath)
        }
      })
    }
  }
}
</script>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| mode | String | normal | normal/scanCode |
| resolution | String | medium | low/medium/high |
| device-position | String | back | front/back |
| flash | String | auto | auto/on/off |
| frame-size | String | large | small/medium/large |

## live-player / live-pusher

直播组件（仅小程序）。

```vue
<template>
  <!-- 直播播放器 -->
  <live-player
    src="rtmp://example.com/live/stream"
    mode="live"
    :autoplay="true"
    :muted="false"
    orientation="vertical"
    object-fit="contain"
    @statechange="onStateChange"
    @error="onError"
  />
</template>
```

## map

地图组件，用于显示地图和标记。

```vue
<template>
  <map
    id="myMap"
    style="width: 100%; height: 300px;"
    :latitude="latitude"
    :longitude="longitude"
    :scale="14"
    :markers="markers"
    :polyline="polyline"
    :circles="circles"
    :controls="controls"
    :show-location="true"
    @markertap="onMarkerTap"
    @regionchange="onRegionChange"
    @tap="onMapTap"
  />
</template>

<script>
export default {
  data() {
    return {
      latitude: 39.909,
      longitude: 116.39742,
      markers: [{
        id: 1,
        latitude: 39.909,
        longitude: 116.39742,
        title: '标记 1',
        iconPath: '/static/marker.png',
        width: 30,
        height: 30
      }],
      polyline: [{
        points: [
          { latitude: 39.909, longitude: 116.39742 },
          { latitude: 39.91, longitude: 116.4 }
        ],
        color: '#FF0000',
        width: 2
      }]
    }
  },
  onReady() {
    this.mapContext = uni.createMapContext('myMap')
  },
  methods: {
    moveToLocation() {
      this.mapContext.moveToLocation({
        latitude: 39.91,
        longitude: 116.4
      })
    },
    getCenterLocation() {
      this.mapContext.getCenterLocation({
        success: (res) => {
          console.log(res.latitude, res.longitude)
        }
      })
    }
  }
}
</script>
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/image.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/video.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/audio.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/camera.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/live-player.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/map.md
-->
