---
title: 使用调试钩子追踪响应式问题
impact: MEDIUM
impactDescription: 调试钩子帮助识别哪些依赖项触发重新渲染和监听器执行
type: efficiency
tags: [vue3, reactivity, debugging, computed, watch, development]
---

# 使用调试钩子追踪响应式问题

**影响：中** - Vue 提供了调试钩子（`onTrack`、`onTrigger`、`renderTracked`、`renderTriggered`）来帮助准确识别哪些响应式依赖项正在被追踪以及哪些变更触发重新执行。这些对于调试性能问题和意外重新渲染非常宝贵。

调试钩子只在开发模式下工作，并在生产构建中被移除。使用它们来理解为什么计算属性、监听器或组件正在重新执行。

## 任务清单

- [ ] 在 computed/watch 上使用 `onTrack` 和 `onTrigger` 选项进行细粒度调试
- [ ] 使用 `onRenderTracked` 和 `onRenderTriggered` 生命周期钩子进行组件渲染调试
- [ ] 在钩子内部添加 `debugger` 语句以暂停执行并检查状态
- [ ] 在生产前移除或注释掉调试钩子（它们是无操作但会增加混乱）

> **注意：** `onTrack` 和 `onTrigger` 是仅用于开发的钩子。它们从生产构建中移除，并且可能不会在测试环境（例如 Vitest、Jest）中触发，具体取决于 Vue 的打包方式。如果你需要在测试中验证响应式行为，使用对响应式状态更改的直接断言，而不是依赖这些调试回调。

**调试计算属性：**
```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2, {
  onTrack(event) {
    // 当依赖项被追踪时调用
    // event.target = 响应式对象
    // event.key = 正在访问的属性
    debugger
    console.log('Tracking:', event)
  },
  onTrigger(event) {
    // 当依赖项变更触发重新计算时调用
    debugger
    console.log('Triggered by:', event)
  }
})
```

**调试监听器：**
```javascript
import { ref, watch, watchEffect } from 'vue'

const source = ref(0)

// 使用 watch()
watch(source, (newVal, oldVal) => {
  console.log('Changed:', oldVal, '->', newVal)
}, {
  onTrack(e) {
    debugger // 暂停以查看正在追踪的内容
  },
  onTrigger(e) {
    debugger // 暂停以查看什么触发了监听器
  }
})

// 使用 watchEffect()
watchEffect(() => {
  console.log('Source is:', source.value)
}, {
  onTrack(e) {
    console.log('Tracking dependency:', e.key)
  },
  onTrigger(e) {
    console.log('Triggered by:', e.key, 'mutation')
  }
})
```

**调试组件渲染：**
```vue
<script setup>
import { onRenderTracked, onRenderTriggered, ref } from 'vue'

const count = ref(0)

// 在渲染期间为每个响应式依赖项访问调用
onRenderTracked((event) => {
  console.log('Render tracked:', event.key, 'from', event.target)
  debugger // 暂停以检查哪些依赖项被追踪
})

// 当响应式依赖项触发重新渲染时调用
onRenderTriggered((event) => {
  console.log('Render triggered by:', event.key)
  console.log('Old value:', event.oldValue)
  console.log('New value:', event.newValue)
  debugger // 暂停以查看究竟是什么导致了重新渲染
})
</script>
```

**Options API 等效：**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  renderTracked(event) {
    console.log('Dependency tracked during render:', event)
    debugger
  },
  renderTriggered(event) {
    console.log('Re-render triggered by:', event)
    debugger
  }
}
```

**调试事件属性：**
```javascript
// 事件对象包含：
{
  effect: ReactiveEffect,  // 被调试的 effect
  target: object,          // 响应式对象
  type: 'get' | 'set' | 'add' | 'delete' | 'clear',
  key: string | symbol,    // 正在访问/变更的属性
  oldValue: any,           // 之前的值（用于 onTrigger）
  newValue: any            // 新值（用于 onTrigger）
}
```

## 参考
- [Vue.js 深入响应式 - 调试](https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging)
- [Vue.js computed() API](https://vuejs.org/api/reactivity-core.html#computed)
- [Vue.js onRenderTracked()](https://vuejs.org/api/composition-api-lifecycle.html#onrendertracked)
