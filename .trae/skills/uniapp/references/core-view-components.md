---
name: 视图组件
description: 用于布局和结构的核心容器组件。在使用 uni-app 的 view、scroll-view、swiper、movable-area、cover-view 等容器组件进行页面布局时调用此技能。
---

# 视图组件

## view

基础容器组件，类似于 HTML 的 `<div>`。

```vue
<template>
  <view class="container">
    <view class="flex-row">
      <view class="item">A</view>
      <view class="item">B</view>
    </view>
    <view class="flex-column">
      <view class="item">C</view>
      <view class="item">D</view>
    </view>
  </view>
</template>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| hover-class | String | none | 按下时的 CSS 类 |
| hover-stop-propagation | Boolean | false | 阻止冒泡到祖先节点 |
| hover-start-time | Number | 50 | 触发悬停状态的延迟（ms） |
| hover-stay-time | Number | 400 | 保持悬停状态的时长（ms） |

**提示：**
- 在小程序中 `<div>` 会自动转换为 `<view>`
- 在 nvue 页面中使用 `<text>` 包裹文本

## scroll-view

可滚动容器，具有增强的滚动能力。

```vue
<template>
  <!-- 垂直滚动 -->
  <scroll-view
    scroll-y
    class="scroll-container"
    @scroll="onScroll"
    @scrolltolower="loadMore"
    :scroll-top="scrollTop"
    :scroll-into-view="targetId"
  >
    <view id="item1">项目 1</view>
    <view id="item2">项目 2</view>
  </scroll-view>

  <!-- 水平滚动 -->
  <scroll-view scroll-x class="horizontal-scroll">
    <view class="scroll-item">1</view>
    <view class="scroll-item">2</view>
  </scroll-view>
</template>
```

**属性：**

| 属性 | 类型 | 描述 |
|------|------|------|
| scroll-x | Boolean | 启用水平滚动 |
| scroll-y | Boolean | 启用垂直滚动 |
| upper-threshold | Number | 距顶部多远触发 scrolltoupper（px） |
| lower-threshold | Number | 距底部多远触发 scrolltolower（px） |
| scroll-top | Number | 垂直滚动位置 |
| scroll-left | Number | 水平滚动位置 |
| scroll-into-view | String | 滚动到视图的元素 ID |
| scroll-with-animation | Boolean | 启用平滑滚动动画 |
| enable-back-to-top | Boolean | iOS：点击状态栏滚动到顶部 |

**事件：**
- `@scroll` - 滚动事件
- `@scrolltoupper` - 到达顶部
- `@scrolltolower` - 到达底部

## swiper

轮播/滑动容器，用于切换内容。

```vue
<template>
  <swiper
    :current="currentIndex"
    :autoplay="true"
    :interval="3000"
    :duration="500"
    :circular="true"
    :indicator-dots="true"
    @change="onSwiperChange"
  >
    <swiper-item>
      <view class="slide">幻灯片 1</view>
    </swiper-item>
    <swiper-item>
      <view class="slide">幻灯片 2</view>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    onSwiperChange(e) {
      this.currentIndex = e.detail.current
    }
  }
}
</script>
```

**swiper 属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| indicator-dots | Boolean | false | 显示分页点 |
| indicator-color | Color | rgba(0,0,0,.3) | 未激活点颜色 |
| indicator-active-color | Color | #000000 | 激活点颜色 |
| autoplay | Boolean | false | 自动播放 |
| current | Number | 0 | 当前幻灯片索引 |
| interval | Number | 5000 | 自动播放间隔（ms） |
| duration | Number | 500 | 过渡时长（ms） |
| circular | Boolean | false | 循环滑动 |
| vertical | Boolean | false | 垂直滑动 |
| previous-margin | String | 0px | 前一张幻灯片边距 |
| next-margin | String | 0px | 后一张幻灯片边距 |

## movable-area / movable-view

可拖动和缩放的容器。

```vue
<template>
  <movable-area class="move-area">
    <movable-view
      :x="x"
      :y="y"
      direction="all"
      :scale="true"
      :scale-min="0.5"
      :scale-max="4"
      @change="onChange"
      @scale="onScale"
    >
      可拖动内容
    </movable-view>
  </movable-area>
</template>
```

**movable-view 属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| direction | String | none | 移动方向：all/vertical/horizontal/none |
| x | Number | | 初始 X 位置 |
| y | Number | | 初始 Y 位置 |
| scale | Boolean | false | 启用缩放 |
| scale-min | Number | 0.5 | 最小缩放 |
| scale-max | Number | 10 | 最大缩放 |
| scale-value | Number | 1 | 初始缩放 |

## cover-view / cover-image

原生覆盖组件，可以覆盖原生组件（地图、视频、画布）。

```vue
<template>
  <map class="map">
    <cover-view class="overlay">覆盖文字</cover-view>
    <cover-image class="marker" src="/static/marker.png" />
  </map>
</template>
```

**限制：**
- 仅在微信小程序、App 和 H5 中支持
- 样式能力有限
- 不能嵌套常规组件

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/view.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/scroll-view.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/swiper.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/movable-area.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/cover-view.md
-->
