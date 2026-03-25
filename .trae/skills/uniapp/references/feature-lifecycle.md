---
name: 页面生命周期
description: 页面和应用生命周期钩子。在使用 uni-app 开发时了解应用和页面的生命周期、执行时机和最佳实践时调用此技能。
---

# 页面生命周期

## 应用生命周期

在 `App.vue` 中：

```javascript
export default {
  globalData: {
    userInfo: null,
    theme: 'light'
  },

  onLaunch(options) {
    // 应用启动（仅一次）
    console.log('应用启动', options)
    this.checkUpdate()
  },

  onShow(options) {
    // 应用显示/前台
    console.log('应用显示', options)
  },

  onHide() {
    // 应用隐藏/后台
    console.log('应用隐藏')
  },

  onError(msg) {
    // 全局错误处理
    console.error('应用错误：', msg)
  },

  onUnhandledRejection(err) {
    // 未处理的 Promise 拒绝
    console.error('未处理的拒绝：', err)
  },

  onPageNotFound(res) {
    // 404 页面未找到
    console.error('页面未找到：', res.path)
    uni.redirectTo({
      url: '/pages/404/404'
    })
  },

  methods: {
    checkUpdate() {
      // 检查应用更新
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('有新版本可用')
        }
      })
    }
  }
}
```

## 页面生命周期

```vue
<script>
export default {
  // === 页面加载 ===
  onLoad(options) {
    // 页面加载，带查询参数
    console.log('页面加载', options)
    // options 包含 URL 查询参数
    // 例如：/pages/detail?id=123 -> options = { id: '123' }
    this.id = options.id
    this.loadData()
  },

  // === 页面显示 ===
  onShow() {
    // 页面显示（每次）
    console.log('页面显示')
    // 适合返回时刷新数据
  },

  // === 页面就绪 ===
  onReady() {
    // 页面就绪，DOM 已渲染
    console.log('页面就绪')
    // 可以安全访问 DOM 元素
    this.initChart()
  },

  // === 页面隐藏 ===
  onHide() {
    // 页面隐藏（导航离开）
    console.log('页面隐藏')
    // 暂停视频、定时器等
  },

  // === 页面卸载 ===
  onUnload() {
    // 页面销毁
    console.log('页面卸载')
    // 清理资源，移除监听
    clearInterval(this.timer)
  },

  // === 下拉刷新 ===
  onPullDownRefresh() {
    // 用户下拉
    console.log('下拉刷新')
    this.refreshData().finally(() => {
      uni.stopPullDownRefresh()
    })
  },

  // === 到达底部 ===
  onReachBottom() {
    // 滚动到底部
    console.log('到达底部')
    this.loadMore()
  },

  // === 页面滚动 ===
  onPageScroll(e) {
    // 页面滚动
    // e.scrollTop: 滚动位置
    this.scrollTop = e.scrollTop
  },

  // === 尺寸变化 ===
  onResize(e) {
    // 页面尺寸变化（如旋转）
    console.log('页面尺寸变化', e.size)
  },

  // === 分享 ===
  onShareAppMessage(res) {
    // 原生分享（小程序）
    if (res.from === 'button') {
      // 来自分享按钮
      console.log(res.target)
    }
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/static/share.png'
    }
  },

  // === 朋友圈分享 ===
  onShareTimeline() {
    // 分享到朋友圈（微信）
    return {
      title: '朋友圈标题',
      query: 'id=123',
      imageUrl: '/static/share.png'
    }
  },

  // === 添加到收藏 ===
  onAddToFavorites() {
    // 添加到小程序收藏
    return {
      title: '收藏标题',
      imageUrl: '/static/fav.png',
      query: 'id=123'
    }
  },

  data() {
    return {
      id: null,
      scrollTop: 0,
      timer: null
    }
  },

  methods: {
    loadData() {
      // 加载页面数据
    },
    refreshData() {
      // 刷新数据
    },
    loadMore() {
      // 加载更多数据
    },
    initChart() {
      // DOM 就绪后初始化图表
    }
  }
}
</script>
```

## 组件生命周期（Vue 2）

```vue
<script>
export default {
  // === 创建 ===
  beforeCreate() {
    // 实例初始化
  },

  created() {
    // 实例创建，数据已观察
    // 适合初始数据加载
  },

  // === 挂载 ===
  beforeMount() {
    // DOM 挂载前
  },

  mounted() {
    // DOM 已挂载
    // 适合 DOM 操作
  },

  // === 更新 ===
  beforeUpdate() {
    // 数据更新前
  },

  updated() {
    // 数据更新后
  },

  // === 销毁 ===
  beforeDestroy() {
    // 实例销毁前
    // 在此清理
  },

  destroyed() {
    // 实例已销毁
  },

  // ===  keep-alive ===
  activated() {
    // 组件激活（keep-alive）
  },

  deactivated() {
    // 组件停用（keep-alive）
  }
}
</script>
```

## 组件生命周期（Vue 3）

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated
} from 'vue'

// setup 在 beforeCreate 之前运行
console.log('setup')

onBeforeMount(() => {
  console.log('onBeforeMount')
})

onMounted(() => {
  console.log('onMounted')
})

onBeforeUpdate(() => {
  console.log('onBeforeUpdate')
})

onUpdated(() => {
  console.log('onUpdated')
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount')
})

onUnmounted(() => {
  console.log('onUnmounted')
})

onActivated(() => {
  console.log('onActivated')
})

onDeactivated(() => {
  console.log('onDeactivated')
})
</script>
```

## 生命周期对比

| 场景 | UniApp 页面 | Vue 组件 |
|------|-------------|----------|
| 初始加载 | onLoad | created |
| DOM 就绪 | onReady | mounted |
| 页面显示 | onShow | - |
| 页面隐藏 | onHide | - |
| 页面销毁 | onUnload | destroyed/unmounted |
| 数据刷新 | onPullDownRefresh | - |
| 无限滚动 | onReachBottom | - |
| 滚动位置 | onPageScroll | - |

## 应用更新管理器

```javascript
// 在 App.vue onLaunch 中
onLaunch() {
  const updateManager = uni.getUpdateManager()

  updateManager.onCheckForUpdate((res) => {
    console.log('有更新：', res.hasUpdate)
  })

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新就绪',
      content: '新版本已下载。重启应用？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(() => {
    console.error('更新失败')
  })
}
```

## 最佳实践

### 数据加载模式

```javascript
export default {
  data() {
    return {
      loading: false,
      error: null,
      data: null
    }
  },

  onLoad(options) {
    this.fetchData(options.id)
  },

  onPullDownRefresh() {
    this.fetchData(this.id).finally(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    async fetchData(id) {
      this.loading = true
      this.error = null
      try {
        this.data = await api.getDetail(id)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
```

### 滚动性能

```javascript
export default {
  data() {
    return {
      scrollTop: 0,
      showBackTop: false
    }
  },

  // 节流滚动事件
  onPageScroll: throttle(function(e) {
    this.scrollTop = e.scrollTop
    this.showBackTop = e.scrollTop > 500
  }, 200),

  methods: {
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  }
}
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/collocation/App.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/api/lifecycle.md
-->
