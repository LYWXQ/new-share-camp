---
title: 永远不要直接解构 reactive() 对象
impact: HIGH
impactDescription: 解构响应式对象会破坏响应式 - 更改不会触发更新
type: capability
tags: [vue3, reactivity, reactive, composition-api, destructuring]
---

# 永远不要直接解构 reactive() 对象

**影响：高** - 解构 `reactive()` 对象会破坏响应式连接。对解构变量的更新不会触发 UI 更新，导致数据显示陈旧。

Vue 的 `reactive()` 使用 JavaScript Proxy 来追踪属性访问。当你解构时，你从代理中提取原始值，失去了响应式连接。这在从可组合函数或导入的状态中解构时尤其危险。

## 任务清单

- [ ] 如果需要响应式，永远不要直接解构响应式对象
- [ ] 在解构前使用 `toRefs()` 将响应式对象属性转换为 refs
- [ ] 考虑完全使用 `ref()` 来避免这个陷阱
- [ ] 从可组合函数导入状态时，在解构前检查它是否是响应式的

**错误示例：**
```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})

// 错误：解构会破坏响应式
const { count, name } = state

// 这些更新作用于原始 state...
state.count++  // state.count 现在是 1

// ...但解构后的变量不会被更新
console.log(count)  // 仍然是 0！失去了响应式
```

```javascript
// 错误：从可组合函数中解构
function useCounter() {
  const state = reactive({ count: 0 })
  return state
}

const { count } = useCounter()  // count 现在是非响应式的原始值
```

**正确示例：**
```javascript
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})

// 正确：使用 toRefs() 保持响应式
const { count, name } = toRefs(state)

state.count++
console.log(count.value)  // 1 - 响应式已保留！（注意：现在需要 .value）
```

```javascript
// 正确：从可组合函数返回 toRefs
function useCounter() {
  const state = reactive({ count: 0 })
  return toRefs(state)  // 现在可以安全地解构
}

const { count } = useCounter()  // count 现在是 ref，响应式已保留
```

```javascript
// 替代方案：直接使用 ref() 完全避免这个问题
import { ref } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 不需要解构，没有陷阱
```

## 参考
- [Vue.js 响应式基础 - reactive()](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive)
- [Vue.js 响应式 API - toRefs()](https://vuejs.org/api/reactivity-utilities.html#torefs)
