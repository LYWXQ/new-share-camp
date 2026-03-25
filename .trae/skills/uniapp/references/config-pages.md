---
name: Pages.json 配置
description: 页面路由、tabBar 和全局样式配置。在配置 uni-app 应用的页面路由、窗口样式、原生导航栏、tabBar 和分包时调用此技能。
---

# Pages.json 配置

`pages.json` 是 uni-app 的全局配置文件，定义页面路由、窗口样式、原生导航栏和 tabBar。

## 基础结构

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" }
    ]
  }
}
```

## 根属性

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| pages | Array | 是 | 页面路由 |
| globalStyle | Object | 否 | 默认窗口样式 |
| tabBar | Object | 否 | tabBar 配置 |
| condition | Object | 否 | 启动模式（仅开发） |
| subPackages | Array | 否 | 分包 |
| preloadRule | Object | 否 | 预加载规则（小程序） |
| easycom | Object | 否 | 自动组件导入 |
| leftWindow/topWindow/rightWindow | Object | 否 | 多窗口（H5） |

## Pages 配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情",
        "navigationStyle": "custom"
      }
    }
  ]
}
```

### 页面样式选项

| 属性 | 类型 | 描述 |
|------|------|------|
| navigationBarTitleText | String | 导航栏标题 |
| navigationBarTextStyle | String | 标题颜色：black/white |
| navigationBarBackgroundColor | HexColor | 导航栏背景色 |
| navigationStyle | String | default/custom |
| enablePullDownRefresh | Boolean | 启用下拉刷新 |
| backgroundColor | HexColor | 背景色 |
| backgroundTextStyle | String | dark/light |
| onReachBottomDistance | Number | 底部距离（px） |
| disableScroll | Boolean | 禁用滚动（小程序） |
| usingComponents | Object | 使用自定义组件 |

## 全局样式

应用于所有页面，除非被覆盖。

```json
{
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "我的应用",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8",
    "backgroundTextStyle": "dark",
    "enablePullDownRefresh": false,
    "onReachBottomDistance": 50,
    "rpxCalcMaxDeviceWidth": 960,
    "rpxCalcBaseDeviceWidth": 375,
    "rpxCalcIncludeWidth": 750
  }
}
```

## TabBar 配置

```json
{
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/image/home.png",
        "selectedIconPath": "static/image/home-active.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "static/image/cat.png",
        "selectedIconPath": "static/image/cat-active.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "static/image/cart.png",
        "selectedIconPath": "static/image/cart-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "static/image/user.png",
        "selectedIconPath": "static/image/user-active.png"
      }
    ]
  }
}
```

### TabBar 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| color | HexColor | 未选中文字颜色 |
| selectedColor | HexColor | 选中文字颜色 |
| backgroundColor | HexColor | 背景色 |
| borderStyle | String | black/white |
| list | Array | tab 项（2-5 个） |
| position | String | bottom/top |

### Tab 项属性

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| pagePath | String | 是 | 页面路径 |
| text | String | 是 | tab 文字 |
| iconPath | String | 否 | 图标路径（81x81px） |
| selectedIconPath | String | 否 | 选中图标 |

### 自定义 TabBar（微信/QQ/抖音）

```json
{
  "tabBar": {
    "custom": true,
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" }
    ]
  }
}
```

在根目录创建 `custom-tab-bar/index` 组件。

## 分包

将应用拆分为更小的块以加快加载速度。

```json
{
  "subPackages": [
    {
      "root": "packageA",
      "pages": [
        { "path": "pages/cat/cat" },
        { "path": "pages/dog/dog" }
      ]
    },
    {
      "root": "packageB",
      "pages": [
        { "path": "pages/apple/apple" },
        { "path": "pages/banana/banana" }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}
```

## EasyCom（自动组件导入）

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u--(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^up-(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
}
```

使用此配置，组件无需注册即可自动导入。

## 配置中的条件编译

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black"
  },
  "condition": {
    "current": 0,
    "list": [
      {
        "name": "test",
        "path": "pages/test/test",
        "query": "id=1"
      }
    ]
  },
  "mp-weixin": {
    "appid": "wx...",
    "setting": {
      "urlCheck": false
    }
  },
  "app-plus": {
    "splashscreen": {
      "alwaysShowBeforeRender": true
    }
  }
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/collocation/pages.md
-->
