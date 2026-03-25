---
title: 使用 computed() 而不是 watchEffect() 获取派生状态
impact: MEDIUM
impactDescription: 使用 watchEffect 来变更 refs 会创建不必要的间接层 - computed() 是声明式的且有缓存
type: efficiency
tags: [vue3, reactivity, computed, watchEffect, best-practice, performance]
---

# 使用 computed() 而不是 watchEffect() 获取派生状态

**影响：中** - 当你需要派生自其他响应式状态的状态时，始终优先选择 `computed()` 而不是使用 `watchEffect()` 来变更 ref。计算属性是声明式的、自动缓存的，并清晰地表达依赖关系。

使用 `watchEffect()` 来变更 ref 虽然有效，但会创建不必要的间接层：你是在基于依赖项命令式地更新状态，而不是声明关系。这使得代码更难理解并阻止 Vue 进行优化。

## 任务清单

- [ ] 当结果是响应式状态的纯转换时使用 `computed()`
- [ ] 只在副作用（DOM 操作、日志记录、API 调用）时使用 `watchEffect()`
- [ ] 永远不要使用 watchEffect 只是为了变更 ref 来获取派生值
- [ ] 记住计算值是缓存的，只在依赖项变化时重新计算

**错误示例：**
```javascript
import { ref, watchEffect } from 'vue'

const A0 = ref(1)
const A1 = ref(2)
const A2 = ref()  // 不必要的 ref

// 错误：使用 watchEffect 派生状态
watchEffect(() => {
  A2.value = A0.value + A1.value
})

// 问题：
// 1. A2 是可写的，当它不应该是
// 2. 命令式而不是声明式
// 3. 没有缓存优化
// 4. 更难追踪依赖项
```

```javascript
// 错误：使用 watchEffect 进行复杂的派生状态
const items = ref([{ price: 10 }, { price: 20 }])
const total = ref(0)

watchEffect(() => {
  total.value = items.value.reduce((sum, item) => sum + item.price, 0)
})
```

**正确示例：**
```javascript
import { ref, computed } from 'vue'

const A0 = ref(1)
const A1 = ref(2)

// 正确：声明式派生状态
const A2 = computed(() => A0.value + A1.value)

// 好处：
// 1. A2 默认是只读的
// 2. 清晰地声明依赖关系
// 3. 缓存 - 只在 A0 或 A1 变化时重新计算
// 4. 易于理解数据流
```

```javascript
// 正确：使用 computed 进行复杂的派生状态
const items = ref([{ price: 10 }, { price: 20 }])

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price, 0)
})

// 多个派生值
const itemCount = computed(() => items.value.length)
const averagePrice = computed(() =>
  items.value.length ? total.value / itemCount.value : 0
)
```

**何时使用 watchEffect 是合适的：**
```javascript
import { ref, watchEffect } from 'vue'

const searchQuery = ref('')

// 正确：watchEffect 用于副作用
watchEffect(() => {
  // 日志记录
  console.log(`Search query changed: ${searchQuery.value}`)

  // DOM 操作
  document.title = `Search: ${searchQuery.value}`
})

// 正确：watchEffect 用于异步副作用
watchEffect(async () => {
  if (searchQuery.value) {
    // API 调用（副作用，不是派生状态）
    await api.logSearch(searchQuery.value)
  }
})
```

**每个使用场景的总结：**
```javascript
// 使用 computed() 当：
// - 你从响应式状态派生一个值
// - 结果是纯的（没有副作用）
// - 你想要缓存
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// 使用 watchEffect() 当：
// - 你需要执行副作用
// - 你与外部系统交互
// - 你需要运行异步操作
watchEffect(() => {
  document.title = fullName.value  // 副作用
})
```

## 参考
- [Vue.js 深入响应式](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue.js 计算属性](https://vuejs.org/guide/essentials/computed.html)
- [Vue.js 监听器](https://vuejs.org/guide/essentials/watchers.html)
