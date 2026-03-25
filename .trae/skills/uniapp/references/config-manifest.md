---
name: Manifest.json 配置
description: 应用配置、权限和平台特定设置。在配置 uni-app 应用的基本信息、权限声明、平台特定功能（如微信小程序、支付宝小程序、App 等）时调用此技能。
---

# Manifest.json 配置

`manifest.json` 是应用配置文件，定义应用名称、图标、权限和平台特定设置。

## 基础配置

```json
{
  "name": "我的应用",
  "appid": "__UNI__XXXXXXX",
  "description": "应用描述",
  "versionName": "1.0.0",
  "versionCode": 100,
  "locale": "auto",
  "debug": false
}
```

### 基础属性

| 属性 | 类型 | 描述 |
|------|------|------|
| name | String | 应用名称 |
| appid | String | DCloud 应用 ID |
| description | String | 应用描述 |
| versionName | String | 版本名称（1.0.0） |
| versionCode | Number | 版本号（整数） |
| locale | String | 默认语言 |
| debug | Boolean | 调试模式 |
| networkTimeout | Object | 网络超时设置 |
| uniStatistics | Object | 统计配置 |

## 网络超时

```json
{
  "networkTimeout": {
    "request": 60000,
    "connectSocket": 60000,
    "uploadFile": 60000,
    "downloadFile": 60000
  }
}
```

## App 配置（app-plus）

```json
{
  "app-plus": {
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "autoclose": true,
      "waiting": true
    },
    "screenOrientation": ["portrait-primary"],
    "modules": {
      "OAuth": {},
      "Payment": {},
      "Push": {}
    },
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.INTERNET\" />"
        ],
        "minSdkVersion": 21,
        "targetSdkVersion": 30
      },
      "ios": {
        "capabilities": {
          "entitlements": {
            "com.apple.developer.push": true
          }
        }
      },
      "sdkConfigs": {
        "payment": {
          "alipay": {},
          "weixin": {}
        }
      }
    },
    "optimization": {
      "subPackages": true
    }
  }
}
```

### 启动页

| 属性 | 类型 | 描述 |
|------|------|------|
| alwaysShowBeforeRender | Boolean | 直到首页渲染完成前显示 |
| autoclose | Boolean | 自动关闭启动页 |
| waiting | Boolean | 显示加载指示器 |

## 小程序配置

### 微信小程序（mp-weixin）

```json
{
  "mp-weixin": {
    "appid": "wx1234567890",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "需要您的位置信息"
      }
    },
    "requiredPrivateInfos": [
      "getLocation"
    ]
  }
}
```

### 支付宝小程序（mp-alipay）

```json
{
  "mp-alipay": {
    "appid": "2021...",
    "allowsAlignRight": true,
    "component2": true
  }
}
```

### 百度小程序（mp-baidu）

```json
{
  "mp-baidu": {
    "appid": "12345678",
    "navigationBarForceEnable": true
  }
}
```

### 抖音小程序（mp-toutiao）

```json
{
  "mp-toutiao": {
    "appid": "tt...",
    "setting": {
      "es6": true,
      "minified": true
    }
  }
}
```

## H5 配置

```json
{
  "h5": {
    "title": "我的应用",
    "template": "index.html",
    "router": {
      "mode": "hash",
      "base": "./"
    },
    "optimization": {
      "treeShaking": {
        "enable": true
      }
    },
    "publicPath": "./",
    "devServer": {
      "port": 8080,
      "disableHostCheck": true
    },
    "sdkConfigs": {
      "maps": {
        "qqmap": {
          "key": "..."
        }
      }
    }
  }
}
```

## Vue 配置

### Vue 2

```json
{
  "vueVersion": "2",
  "sassImplementationName": "dart-sass"
}
```

### Vue 3

```json
{
  "vueVersion": "3"
}
```

## 权限配置

### Android 权限

```json
{
  "app-plus": {
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.INTERNET\" />",
          "<uses-permission android:name=\"android.permission.CAMERA\" />",
          "<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\" />",
          "<uses-permission android:name=\"android.permission.READ_EXTERNAL_STORAGE\" />",
          "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\" />"
        ]
      }
    }
  }
}
```

### iOS 隐私描述

```json
{
  "app-plus": {
    "distribute": {
      "ios": {
        "privacyDescription": {
          "NSCameraUsageDescription": "需要相机权限用于扫描二维码",
          "NSPhotoLibraryUsageDescription": "需要相册权限用于上传图片",
          "NSLocationWhenInUseUsageDescription": "需要位置权限用于查找附近门店"
        }
      }
    }
  }
}
```

## 常用模块配置

### OAuth（登录）

```json
{
  "app-plus": {
    "modules": {
      "OAuth": {}
    },
    "distribute": {
      "sdkConfigs": {
        "oauth": {
          "weixin": {
            "appid": "wx...",
            "appsecret": "...",
            "UniversalLinks": "https://..."
          }
        }
      }
    }
  }
}
```

### 支付

```json
{
  "app-plus": {
    "modules": {
      "Payment": {}
    },
    "distribute": {
      "sdkConfigs": {
        "payment": {
          "alipay": {},
          "weixin": {
            "appid": "wx..."
          }
        }
      }
    }
  }
}
```

### 推送通知

```json
{
  "app-plus": {
    "modules": {
      "Push": {}
    },
    "distribute": {
      "sdkConfigs": {
        "push": {
          "unipush": {}
        }
      }
    }
  }
}
```

### 分享

```json
{
  "app-plus": {
    "modules": {
      "Share": {}
    },
    "distribute": {
      "sdkConfigs": {
        "share": {
          "weixin": {
            "appid": "wx..."
          }
        }
      }
    }
  }
}
```

## 统计配置

```json
{
  "uniStatistics": {
    "enable": true
  },
  "app-plus": {
    "uniStatistics": {
      "enable": true
    }
  },
  "mp-weixin": {
    "uniStatistics": {
      "enable": true
    }
  }
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/collocation/manifest.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/collocation/manifest-app.md
-->
