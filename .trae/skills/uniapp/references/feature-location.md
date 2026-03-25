---
name: 位置服务
description: 地理定位、地图操作和基于位置的服务。在使用 uni-app 获取位置信息、使用地图组件或进行位置相关操作时调用此技能。
---

# 位置服务

## 获取当前位置

### uni.getLocation

获取当前地理位置。

```javascript
uni.getLocation({
  type: 'wgs84', // wgs84/gcj02（地图显示用 gcj02）
  altitude: false, // 包含海拔
  geocode: false, // 包含地址信息（App）
  highAccuracyExpireTime: 3000, // 高精度超时
  success: (res) => {
    console.log('纬度：', res.latitude)
    console.log('经度：', res.longitude)
    console.log('速度：', res.speed)
    console.log('精度：', res.accuracy)
    // 仅 App：
    console.log('海拔：', res.altitude)
    console.log('地址：', res.address)
  },
  fail: (err) => {
    console.error('定位失败：', err)
  }
})
```

**响应属性：**

| 属性 | 类型 | 描述 |
|------|------|------|
| latitude | Number | 纬度 |
| longitude | Number | 经度 |
| speed | Number | 速度（m/s） |
| accuracy | Number | 精度（米） |
| altitude | Number | 海拔（米） |
| verticalAccuracy | Number | 垂直精度 |
| horizontalAccuracy | Number | 水平精度 |
| address | Object | 地址信息（App） |

### uni.getFuzzyLocation（微信）

获取模糊位置（更好的隐私保护，更快）。

```javascript
uni.getFuzzyLocation({
  type: 'wgs84',
  success: (res) => {
    console.log(res.latitude, res.longitude)
  }
})
```

## 选择位置

### uni.chooseLocation

打开地图选择位置。

```javascript
uni.chooseLocation({
  latitude: 39.9,
  longitude: 116.4,
  keyword: '餐厅',
  success: (res) => {
    console.log('名称：', res.name)
    console.log('地址：', res.address)
    console.log('纬度：', res.latitude)
    console.log('经度：', res.longitude)
  }
})
```

## 打开位置

### uni.openLocation

打开外部地图应用。

```javascript
uni.openLocation({
  latitude: 39.9,
  longitude: 116.4,
  name: '目的地名称',
  address: '完整地址',
  scale: 18
})
```

## 位置变化监听

### uni.startLocationUpdate

开始后台位置更新。

```javascript
uni.startLocationUpdate({
  type: 'gcj02',
  success: () => {
    console.log('位置更新已开始')
  }
})
```

### uni.startLocationUpdateBackground

开始后台定位（需要权限）。

```javascript
uni.startLocationUpdateBackground({
  type: 'gcj02',
  success: () => {
    console.log('后台定位已开始')
  }
})
```

### 监听位置变化

```javascript
uni.onLocationChange((res) => {
  console.log('位置更新：', res.latitude, res.longitude)
})

// 停止监听
uni.offLocationChange(callback)
```

### 停止位置更新

```javascript
uni.stopLocationUpdate({
  success: () => {
    console.log('位置更新已停止')
  }
})
```

## 地图组件

### 基础地图

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
    :show-location="true"
    @markertap="onMarkerTap"
    @regionchange="onRegionChange"
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
        height: 30,
        callout: {
          content: 'Hello',
          color: '#000',
          fontSize: 14,
          borderRadius: 5,
          padding: 10,
          display: 'BYCLICK'
        }
      }],
      polyline: [{
        points: [
          { latitude: 39.909, longitude: 116.39742 },
          { latitude: 39.91, longitude: 116.4 }
        ],
        color: '#FF0000',
        width: 2,
        dottedLine: false
      }],
      circles: [{
        latitude: 39.909,
        longitude: 116.39742,
        radius: 100,
        strokeWidth: 2,
        fillColor: '#FF000020'
      }]
    }
  }
}
</script>
```

### 地图上下文操作

```javascript
export default {
  onReady() {
    this.mapContext = uni.createMapContext('myMap')
  },

  methods: {
    // 获取中心位置
    getCenter() {
      this.mapContext.getCenterLocation({
        success: (res) => {
          console.log('中心：', res.latitude, res.longitude)
        }
      })
    },

    // 移动到位置
    moveToLocation() {
      this.mapContext.moveToLocation({
        latitude: 39.9,
        longitude: 116.4
      })
    },

    // 平移标记
    translateMarker() {
      this.mapContext.translateMarker({
        markerId: 1,
        destination: {
          latitude: 39.91,
          longitude: 116.41
        },
        autoRotate: true,
        rotate: 0,
        duration: 1000
      })
    },

    // 在视图中包含点
    includePoints() {
      this.mapContext.includePoints({
        points: [
          { latitude: 39.9, longitude: 116.4 },
          { latitude: 39.91, longitude: 116.41 }
        ],
        padding: [10, 10, 10, 10]
      })
    },

    // 获取区域
    getRegion() {
      this.mapContext.getRegion({
        success: (res) => {
          console.log('西南：', res.southwest)
          console.log('东北：', res.northeast)
        }
      })
    },

    // 添加标记
    addMarkers() {
      this.mapContext.addMarkers({
        markers: [{
          id: 2,
          latitude: 39.91,
          longitude: 116.41,
          title: '新标记'
        }],
        clear: false // 不清除现有标记
      })
    },

    // 移除标记
    removeMarkers() {
      this.mapContext.removeMarkers({
        markerIds: [1, 2]
      })
    }
  }
}
```

## 坐标系

| 坐标系 | 描述 | 用途 |
|--------|------|------|
| WGS84 | GPS 坐标 | 国际标准 |
| GCJ02 | 火星坐标 | 中国国家标准 |
| BD09 | 百度坐标 | 仅百度地图 |

**注意：** 在中国显示地图时，请使用 `gcj02`。

## 权限配置

### 小程序

添加到 `manifest.json`：

```json
{
  "mp-weixin": {
    "permission": {
      "scope.userLocation": {
        "desc": "需要您的位置信息来查找附近门店"
      }
    },
    "requiredPrivateInfos": [
      "getLocation",
      "chooseLocation"
    ]
  }
}
```

### App（Android）

```json
{
  "app-plus": {
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\" />",
          "<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\" />"
        ]
      }
    }
  }
}
```

### App（iOS）

```json
{
  "app-plus": {
    "distribute": {
      "ios": {
        "privacyDescription": {
          "NSLocationWhenInUseUsageDescription": "需要位置权限来查找附近门店",
          "NSLocationAlwaysUsageDescription": "需要后台定位权限用于导航"
        }
      }
    }
  }
}
```

## 最佳实践

### 权限处理

```javascript
async function getLocationWithPermission() {
  try {
    // 检查权限
    const setting = await uni.getSetting()
    if (!setting.authSetting['scope.userLocation']) {
      // 请求权限
      await uni.authorize({ scope: 'scope.userLocation' })
    }

    // 获取位置
    const res = await uni.getLocation({ type: 'gcj02' })
    return res
  } catch (err) {
    if (err.errMsg.includes('auth deny')) {
      uni.showModal({
        title: '需要权限',
        content: '请在设置中开启位置权限',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting()
          }
        }
      })
    }
    throw err
  }
}
```

### 距离计算

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // 距离（公里）
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/location/location.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/location/location-change.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/location/open-location.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/map.md
-->
