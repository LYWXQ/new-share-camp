---
title: 对永远不应该响应式的对象使用 markRaw()
impact: MEDIUM
impactDescription: 库实例、DOM 节点和复杂对象在被 Vue 代理包装时会导致开销和错误
type: efficiency
tags: [vue3, reactivity, markRaw, performance, external-libraries, dom]
---

# 对永远不应该响应式的对象使用 markRaw()

**影响：中** - Vue 的 `markRaw()` 告诉响应式系统永远不要将对象包装在 Proxy 中。将它用于库实例、DOM 节点、具有内部状态的类实例和 Vue 不应该追踪的复杂对象。这可以防止不必要的代理开销并避免双重代理的微妙错误。

没有 `markRaw()`，将这些对象放在响应式状态中会导致 Vue 将它们包装在 Proxy 中，这可能破坏库内部、导致身份问题，并在不需要变更追踪的对象上浪费内存。

## 任务清单

- [ ] 对第三方库实例（地图、图表、编辑器）使用 `markRaw()`
- [ ] 对存储在响应式状态中的 DOM 元素使用 `markRaw()`
- [ ] 对管理自己状态的类实例使用 `markRaw()`
- [ ] 对永远不会改变的大型静态数据使用 `markRaw()`
- [ ] 记住：markRaw 只影响根级别 - 嵌套对象可能仍然被代理

**错误示例：**
```javascript
import { reactive, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import * as monaco from 'monaco-editor'

// 错误：库实例被包装在 Proxy 中
const state = reactive({
  map: new mapboxgl.Map({ container: 'map' }),  // 被代理！
  editor: monaco.editor.create(element, {}),    // 被代理！
})

// 问题：
// 1. 库的内部 this 引用可能中断
// 2. 不必要的内存开销
// 3. 方法可能无法通过代理正常工作
// 4. 性能下降

// 错误：响应式状态中的 DOM 元素
const elements = reactive({
  container: document.getElementById('app'),  // 被代理的 DOM 节点！
})
```

**正确示例：**
```javascript
import { reactive, markRaw, shallowRef } from 'vue'
import mapboxgl from 'mapbox-gl'
import * as monaco from 'monaco-editor'

// 正确：将库实例标记为原始
const state = reactive({
  map: markRaw(new mapboxgl.Map({ container: 'map' })),
  editor: markRaw(monaco.editor.create(element, {})),
})

// 正确：或对可变引用使用 shallowRef
const map = shallowRef(null)
onMounted(() => {
  map.value = markRaw(new mapboxgl.Map({ container: 'map' }))
})

// 正确：大型静态数据
const geoJsonData = markRaw(await fetch('/huge-geojson.json').then(r => r.json()))
const state = reactive({
  mapData: geoJsonData  // 不会被代理
})
```

**具有内部状态的类实例：**
```javascript
import { markRaw, reactive } from 'vue'

class WebSocketManager {
  constructor(url) {
    this.socket = new WebSocket(url)
    this.listeners = new Map()
  }

  on(event, callback) {
    this.listeners.set(event, callback)
  }
}

// 正确：标记类实例
const wsManager = markRaw(new WebSocketManager('ws://example.com'))

const state = reactive({
  connection: wsManager  // 不会被代理
})

// 仍然可以正常使用实例
state.connection.on('message', handleMessage)
```

**注意：markRaw 只影响根级别：**
```javascript
import { markRaw, reactive } from 'vue'

const rawObject = markRaw({
  nested: { value: 1 }  // 这个嵌套对象没有被标记为原始
})

const state = reactive({
  data: rawObject
})

// rawObject 本身不会被代理
// 但如果你通过响应式父级访问嵌套对象：
const container = reactive({ raw: rawObject })
// container.raw.nested 在某些情况下可能仍然被代理

// 更安全：对容器使用 shallowRef
import { shallowRef } from 'vue'
const safeContainer = shallowRef(rawObject)
```

**与 shallowRef 结合使用以获得最佳效果：**
```javascript
import { shallowRef, markRaw, onMounted, onUnmounted } from 'vue'

// 模式：shallowRef + markRaw 用于外部库实例
export function useMapbox(containerId) {
  const map = shallowRef(null)

  onMounted(() => {
    const instance = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11'
    })

    // 标记为原始以防止任何代理包装
    map.value = markRaw(instance)
  })

  onUnmounted(() => {
    map.value?.remove()
  })

  return { map }
}
```

## 参考
- [Vue.js markRaw() API](https://vuejs.org/api/reactivity-advanced.html#markraw)
- [Vue.js 减少响应式开销](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
- [Vue.js 深入响应式](https://vuejs.org/guide/extras/reactivity-in-depth.html)
