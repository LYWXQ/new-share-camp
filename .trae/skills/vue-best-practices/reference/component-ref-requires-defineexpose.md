---
title: 组件引用需要使用 Script Setup 的 defineExpose
impact: HIGH
impactDescription: 父组件无法访问子组件 ref 属性，除非显式暴露
type: gotcha
tags: [vue3, template-refs, script-setup, defineExpose, component-communication]
---

# 组件引用需要使用 Script Setup 的 defineExpose

**影响：高** - 使用 `<script setup>` 的组件默认是私有的。使用模板引用访问子组件的父组件会得到一个空对象，除非子组件使用 `defineExpose()` 显式暴露属性。这是与 Options API 行为的根本变化。

这在从 Options API 迁移时让许多开发者感到意外，在 Options API 中 `this.$refs.child` 给予对子实例的完全访问权限。

## 任务清单

- [ ] 使用 `defineExpose()` 显式暴露属性/方法给父级 refs
- [ ] 只暴露必要的 - 保持组件内部私有
- [ ] 将暴露的 API 记录为它们形成组件的公共接口
- [ ] 优先使用 props/emit 进行父子通信；谨慎使用 refs
- [ ] 在任何 await 操作之前调用 defineExpose（参见异步注意事项）

**错误示例：**
```vue
<!-- ChildComponent.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const internalState = ref('private')

function increment() {
  count.value++
}

function reset() {
  count.value = 0
}

// 错误：没有暴露 - 父级 ref 看到空对象
</script>

<template>
  <div>{{ count }}</div>
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

onMounted(() => {
  // 错误：childRef.value 是 {} - 空对象！
  console.log(childRef.value.count) // undefined
  childRef.value.increment() // TypeError: not a function
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

**正确示例：**
```vue
<!-- ChildComponent.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const internalState = ref('private') // 保持这个私有

function increment() {
  count.value++
}

function reset() {
  count.value = 0
}

// 正确：显式暴露公共 API
defineExpose({
  count,      // 暴露 ref
  increment,  // 暴露方法
  reset
  // internalState 未暴露 - 保持私有
})
</script>

<template>
  <div>{{ count }}</div>
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

onMounted(() => {
  // 正确：可以访问暴露的属性
  console.log(childRef.value.count) // 0
  childRef.value.increment() // 有效！

  // internalState 不可访问（私有）
  console.log(childRef.value.internalState) // undefined
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

```vue
<!-- 输入包装器示例 - 暴露原生元素 -->
<script setup>
import { ref } from 'vue'

const inputEl = ref(null)

// 暴露原生输入供父级访问（例如，用于聚焦）
defineExpose({
  focus: () => inputEl.value?.focus(),
  blur: () => inputEl.value?.blur(),
  // 或直接暴露元素
  el: inputEl
})
</script>

<template>
  <input ref="inputEl" v-bind="$attrs" />
</template>
```

```javascript
// Options API 等效使用 expose 选项
export default {
  expose: ['count', 'increment', 'reset'],
  data() {
    return {
      count: 0,
      internalState: 'private'
    }
  },
  methods: {
    increment() { this.count++ },
    reset() { this.count = 0 }
  }
}
```

## 最佳实践提醒

组件 refs 在父级和子级之间创建紧耦合。优先使用标准模式：

```vue
<!-- 首选：使用 props 和 emit 进行通信 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<!-- 只对命令式操作如 focus()、scrollTo() 等使用 refs -->
```

## 参考
- [Vue.js 组件 Refs](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)
- [Script Setup - defineExpose](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
