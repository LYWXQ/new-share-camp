---
title: Props 是只读的 - 永远不要变更 Props
impact: HIGH
impactDescription: 变更 props 会破坏单向数据流并导致不可预测的父子状态同步问题
type: gotcha
tags: [vue3, props, one-way-data-flow, mutation, component-design]
---

# Props 是只读的 - 永远不要变更 Props

**影响：高** - Vue 中的 Props 遵循单向数据流：仅从父到子。在子组件中变更 prop 会违反此约定，触发 Vue 警告并导致难以调试的状态同步问题。父组件失去对它传递的数据的控制。

Props 是渲染时来自父组件的"快照"。Vue 的响应式系统在父级追踪 props - 在子级变更不会通知父级，导致状态不一致。

对于对象/数组 props 这尤其危险，因为 JavaScript 通过引用传递它们，允许在不赋值的情况下进行变更。

## 任务清单

- [ ] 永远不要给 props 赋新值
- [ ] 永远不要直接变更对象或数组 prop 属性
- [ ] 使用 emit 请求父级进行更改
- [ ] 如果你需要修改基于 prop 的数据，创建本地副本
- [ ] 使用计算属性获取派生值

## 问题

**错误 - 直接原始 prop 变更：**
```vue
<script setup>
const props = defineProps({
  count: Number
})

// 错误：Vue 会警告变更 props
function increment() {
  props.count++ // 变更尝试 - 这会失败
}
</script>
```

**错误 - 对象/数组 prop 变更（静默但危险）：**
```vue
<script setup>
const props = defineProps({
  user: Object,
  items: Array
})

// 错误：没有警告，但破坏数据流！
function updateUser() {
  props.user.name = 'New Name' // 变更父级的对象
}

function addItem() {
  props.items.push({ id: 1 }) // 变更父级的数组
}
</script>
```

这种模式很危险，因为：
1. 父组件不知道变更
2. 数据可能变得不同步
3. 使调试困难 - 变更来自哪里？
4. 破坏组件约定

## 模式 1：向父级发送事件

让父级处理所有数据更改。

**正确：**
```vue
<!-- ChildComponent.vue -->
<script setup>
const props = defineProps({
  count: Number,
  user: Object
})

const emit = defineEmits(['update:count', 'update-user'])

function increment() {
  emit('update:count', props.count + 1)
}

function updateName(newName) {
  emit('update-user', { ...props.user, name: newName })
}
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent
    :count="count"
    :user="user"
    @update:count="count = $event"
    @update-user="user = $event"
  />
</template>
```

## 模式 2：可编辑数据的本地副本（Prop 作为初始值）

当组件需要使用 prop 数据的修改版本时。

**正确：**
```vue
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialValue: String,
  user: Object
})

// 用于编辑的本地副本
const localValue = ref(props.initialValue)

// 对象的深拷贝
const localUser = ref({ ...props.user })

// 当父级更改 prop 时同步
watch(() => props.initialValue, (newVal) => {
  localValue.value = newVal
})

watch(() => props.user, (newUser) => {
  localUser.value = { ...newUser }
}, { deep: true })
</script>

<template>
  <input v-model="localValue" />
  <input v-model="localUser.name" />
</template>
```

## 模式 3：用于转换的计算属性

当你需要 prop 的派生/转换版本时。

**正确：**
```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  items: Array
})

// 派生值 - 不变更 prop
const uppercaseText = computed(() => props.text.toUpperCase())

// 过滤视图 - 不变更 prop
const activeItems = computed(() =>
  props.items.filter(item => item.active)
)
</script>
```

## 模式 4：双向绑定的 v-model

对于需要双向绑定的表单类组件。

**正确：**
```vue
<!-- CustomInput.vue -->
<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <!-- v-model 是 :modelValue + @update:modelValue 的简写 -->
  <CustomInput v-model="text" />
</template>
```

## 常见错误：认为对象变更是安全的

```vue
<script setup>
const props = defineProps({ config: Object })

// 这"有效"但是反模式！
props.config.theme = 'dark' // 没有 Vue 警告，但仍然错误
</script>
```

Vue 不警告是因为它无法有效检测深度变更。但这仍然：
- 破坏单向数据流
- 使组件不可预测
- 导致维护噩梦

**始终将 props 视为深度冻结。**

## 参考
- [Vue.js Props - 单向数据流](https://vuejs.org/guide/components/props.html#one-way-data-flow)
- [Vue.js Props - 变更对象/数组 Props](https://vuejs.org/guide/components/props.html#mutating-object-array-props)
