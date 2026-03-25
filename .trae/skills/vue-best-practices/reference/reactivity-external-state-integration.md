---
title: 对外部状态库使用 shallowRef 模式
impact: MEDIUM
impactDescription: 外部状态系统（Immer、XState、Redux）应该使用 shallowRef 以避免在代理中双重包装
type: efficiency
tags: [vue3, reactivity, shallowRef, external-state, immer, xstate, integration]
---

# 对外部状态库使用 shallowRef 模式

**影响：中** - 当将 Vue 与外部状态管理库（Immer、XState、Redux、MobX）集成时，使用 `shallowRef()` 来保存外部状态。这可以防止 Vue 将外部状态深度包装在代理中，这可能导致冲突和性能问题。

模式：将外部状态保存在 `shallowRef` 中，当外部系统更新时完全替换 `.value`。这给了 Vue 响应式，同时让外部库管理状态内部。

## 任务清单

- [ ] 使用 `shallowRef()` 保存外部库状态
- [ ] 当外部状态变化时完全替换 `.value`（不要变更）
- [ ] 集成产生新状态对象的更新函数
- [ ] 考虑将此模式用于不可变数据结构

**与 Immer 集成：**
```javascript
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)

  function update(updater) {
    // Immer 产生一个新的不可变状态
    // 完全替换 shallowRef 值以触发响应式
    state.value = produce(state.value, updater)
  }

  return [state, update]
}

// 使用
const [todos, updateTodos] = useImmer([
  { id: 1, text: 'Learn Vue', done: false }
])

// 使用 Immer 的可变 API 更新（产生不可变结果）
updateTodos(draft => {
  draft[0].done = true
  draft.push({ id: 2, text: 'Use Immer', done: false })
})
```

**与 XState 集成：**
```javascript
import { createMachine, interpret } from 'xstate'
import { shallowRef, onUnmounted } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)

  const service = interpret(machine)
    .onTransition((newState) => {
      // 每次转换时完全替换状态
      state.value = newState
    })
    .start()

  const send = (event) => service.send(event)

  onUnmounted(() => service.stop())

  return { state, send }
}

// 使用
const { state, send } = useMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } }
  }
})

// 在模板中：state.value.matches('active')
send('TOGGLE')
```

**与 Redux 风格的存储集成：**
```javascript
import { shallowRef, readonly } from 'vue'

export function createStore(reducer, initialState) {
  const state = shallowRef(initialState)

  function dispatch(action) {
    state.value = reducer(state.value, action)
  }

  function getState() {
    return state.value
  }

  return {
    state: readonly(state),  // 防止直接变更
    dispatch,
    getState
  }
}

// 使用
const store = createStore(
  (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count: state.count + 1 }
      default:
        return state
    }
  },
  { count: 0 }
)

store.dispatch({ type: 'INCREMENT' })
console.log(store.state.value.count) // 1
```

**为什么对外部状态不使用 ref()：**
```javascript
import { ref } from 'vue'
import { produce } from 'immer'

// 错误：ref() 深度包装状态
const state = ref({ nested: { value: 1 } })

// 这会产生双重代理：
// 1. Vue 将 state 包装在 Proxy 中
// 2. 外部库可能也包装/期望原始对象
// 3. 导致身份问题和潜在冲突

// 错误：用 Immer 变更 ref
state.value = produce(state.value, draft => {
  draft.nested.value = 2
})
// Vue 对 state.value 的深度代理可能干扰 Immer 的代理
```

**使用 shallowRef 的正确模式：**
```javascript
import { shallowRef } from 'vue'

// 正确：shallowRef 只追踪 .value 替换
const state = shallowRef({ nested: { value: 1 } })

// 外部库使用内部的原始对象工作
state.value = produce(state.value, draft => {
  draft.nested.value = 2
})
// 清晰的分离：Vue 追踪外部 ref，库管理内部状态
```

## 参考
- [Vue.js 深入响应式 - 与外部状态集成](https://vuejs.org/guide/extras/reactivity-in-depth.html#integration-with-external-state-systems)
- [Vue.js shallowRef API](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Immer 文档](https://immerjs.github.io/immer/)
- [XState 文档](https://xstate.js.org/)
