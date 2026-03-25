---
title: 对大型对象和外部数据使用 shallowRef
impact: MEDIUM
impactDescription: 大型对象的深度响应式会导致性能开销 - shallowRef 只追踪 .value 的变化
type: efficiency
tags: [vue3, reactivity, shallowRef, performance, optimization]
---

# 对大型对象和外部数据使用 shallowRef

**影响：中** - 默认情况下，`ref()` 使对象深度响应式，将所有嵌套属性包装在 Proxy 中。对于大型数据结构、外部库或不可变数据，这会造成不必要的开销。使用 `shallowRef()` 只追踪 `.value` 的变化。

`shallowRef()` 非常适合来自 API 的大型数据集、外部库对象、DOM 节点或由外部库管理的对象。Vue 只追踪 `.value` 何时被替换，而不是内部变更，显著降低响应式开销。

## 任务清单

- [ ] 对不会被变更的大型 API 响应数据使用 `shallowRef()`
- [ ] 对外部库对象（地图、图表等）使用 `shallowRef()`
- [ ] 对具有自己状态管理的类实例使用 `shallowRef()`
- [ ] 对永远不应该响应式的对象使用 `markRaw()`（例如，第三方实例）
- [ ] 记住：使用 shallowRef，你必须完全替换 `.value` 才能触发更新

**错误示例：**
```javascript
import { ref } from 'vue'

// 低效：大型数据集上的深度响应式
const users = ref(await fetchUsers()) // 10,000 个用户，每个都是深度响应式的

// 低效：外部库包装在 Proxy 中
const mapInstance = ref(new mapboxgl.Map({ /* ... */ }))

// 低效：大型不可变 API 响应
const apiResponse = ref(await fetch('/api/big-data').then(r => r.json()))
```

**正确示例：**
```javascript
import { shallowRef, markRaw, triggerRef } from 'vue'

// 高效：只追踪 .value 替换
const users = shallowRef(await fetchUsers())

// 通过替换整个数组来更新
users.value = await fetchUsers()

// 如果你进行了变更并需要触发更新，使用 triggerRef
users.value.push(newUser)
triggerRef(users) // 手动触发监听器

// 高效：外部库对象
const mapInstance = shallowRef(null)
onMounted(() => {
  mapInstance.value = new mapboxgl.Map({ /* ... */ })
})

// 对永远不应该响应式的对象使用最佳方案
const thirdPartyLib = markRaw(new SomeLibrary())
// 这个对象即使在 reactive() 中使用也不会被包装在 Proxy 中
```

```vue
<script setup>
import { shallowRef } from 'vue'

// 大型分页数据 - 只关心页面变化时
const pageData = shallowRef([])

async function loadPage(page) {
  // 完全替换以触发响应式
  pageData.value = await api.getPage(page)
}

// 模板仍然有效 - shallowRef 在模板中解包
</script>

<template>
  <div v-for="item in pageData" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

```javascript
// 比较：ref() vs shallowRef()

// 使用 ref()：Vue 包装每个嵌套属性
const deep = ref({
  level1: {
    level2: {
      level3: { value: 1 }
    }
  }
})
deep.value.level1.level2.level3.value++ // 被追踪！

// 使用 shallowRef()：只追踪 .value
const shallow = shallowRef({
  level1: {
    level2: {
      level3: { value: 1 }
    }
  }
})
shallow.value.level1.level2.level3.value++ // 不被追踪！
shallow.value = { /* 新对象 */ } // 被追踪！
```

## 参考
- [Vue.js 响应式基础 - 减少大型不可变结构的响应式开销](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
- [Vue.js shallowRef API](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Vue.js markRaw API](https://vuejs.org/api/reactivity-advanced.html#markraw)
