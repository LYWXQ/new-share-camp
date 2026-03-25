---
title: 在 onUnmounted 中清理事件监听器和定时器
impact: HIGH
impactDescription: 未能清理副作用会导致内存泄漏和幽灵事件处理程序
type: capability
tags: [vue3, lifecycle, memory-leak, event-listeners, intervals, cleanup]
---

# 在 onUnmounted 中清理事件监听器和定时器

**影响：高** - 当组件卸载时未能清理事件监听器、定时器、超时和订阅会导致内存泄漏和继续运行的幽灵处理程序，在单页应用中导致性能下降和微妙的错误。

当使用自定义事件、定时器、WebSocket 连接或第三方库时，始终在 `onUnmounted`（Composition API）或 `unmounted`（Options API）中清理。

## 任务清单

- [ ] 跟踪所有 addEventListener 调用并在 onUnmounted 中移除它们
- [ ] 在 onUnmounted 中清除所有 setInterval 和 setTimeout 调用
- [ ] 取消订阅外部事件发射器和 observables
- [ ] 断开 WebSocket 连接和第三方库实例
- [ ] 如果清理必须在 DOM 移除之前发生，使用 `onBeforeUnmount`

**错误示例：**
```javascript
// Composition API - 错误：没有清理
import { onMounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      // 这些在组件卸载后继续运行！
      window.addEventListener('resize', handleResize)
      setInterval(pollServer, 5000)
      socket.on('message', handleMessage)
    })
  }
}
```

```javascript
// Options API - 错误：没有清理
export default {
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.timer = setInterval(this.refresh, 10000)
  }
  // 组件卸载，但监听器和定时器持续存在！
}
```

**正确示例：**
```javascript
// Composition API - 正确：适当清理
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const intervalId = ref(null)

    const handleResize = () => {
      // 处理 resize
    }

    const handleMessage = (msg) => {
      // 处理 message
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      intervalId.value = setInterval(pollServer, 5000)
      socket.on('message', handleMessage)
    })

    onUnmounted(() => {
      // 清理所有内容！
      window.removeEventListener('resize', handleResize)

      if (intervalId.value) {
        clearInterval(intervalId.value)
      }

      socket.off('message', handleMessage)
    })
  }
}
```

```javascript
// Options API - 正确：适当清理
export default {
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.timer = setInterval(this.refresh, 10000)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    handleScroll() { /* ... */ },
    refresh() { /* ... */ }
  }
}
```

## 使用可组合模式进行自动清理

```javascript
// 可复用的可组合函数，带自动清理
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })

  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}

export function useInterval(callback, delay) {
  let intervalId = null

  onMounted(() => {
    intervalId = setInterval(callback, delay)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
}

// 使用 - 清理是自动的
import { useEventListener, useInterval } from './composables'

export default {
  setup() {
    useEventListener(window, 'resize', handleResize)
    useInterval(pollServer, 5000)
    // 不需要手动清理！
  }
}
```

## VueUse 替代方案

```javascript
// VueUse 提供感知清理的可组合函数
import { useEventListener, useIntervalFn } from '@vueuse/core'

export default {
  setup() {
    // 卸载时自动清理
    useEventListener(window, 'resize', handleResize)

    const { pause, resume } = useIntervalFn(pollServer, 5000)
    // 还提供 pause/resume 控制
  }
}
```

## 参考
- [Vue.js 生命周期钩子](https://vuejs.org/guide/essentials/lifecycle.html)
- [VueUse - useEventListener](https://vueuse.org/core/useEventListener/)
