---
name: component-props
description: 使用类型安全和验证声明和使用 props
---

# 组件 Props

Props 是用于从父组件向子组件传递数据的自定义属性。

## 基于类型的声明（推荐）

使用 TypeScript 接口配合 `defineProps`：

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: string[]
}

const props = defineProps<Props>()
</script>
```

## 响应式 Props 解构（3.5+）

在保持响应式的同时解构 props：

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  count?: number
}

const { msg = 'hello', count = 0 } = defineProps<Props>()

// msg 和 count 都是响应式的
watchEffect(() => {
  console.log(msg, count)
})
</script>
```

### 将解构的 props 传递给函数

```ts
const { foo } = defineProps(['foo'])

// ❌ 无法工作 - 传递的是值而非响应式源
watch(foo, /* ... */)

// ✅ 包装在 getter 中
watch(() => foo, /* ... */)

// ✅ 用于 composables
useComposable(() => foo)
```

## 使用 withDefaults 设置默认值（3.4 及以下）

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two'] // 对象/数组使用工厂函数
})
</script>
```

## 运行时声明

用于不使用 TypeScript 的运行时验证：

```vue
<script setup lang="ts">
const props = defineProps({
  // 基本类型检查
  propA: Number,
  // 多种类型
  propB: [String, Number],
  // 必需
  propC: { type: String, required: true },
  // 带默认值
  propD: { type: Number, default: 100 },
  // 对象使用工厂默认值
  propE: {
    type: Object,
    default: () => ({ message: 'hello' })
  },
  // 自定义验证器
  propF: {
    validator(value: string) {
      return ['success', 'warning', 'danger'].includes(value)
    }
  }
})
</script>
```

## Prop 类型

支持的 `type` 值：
- `String`, `Number`, `Boolean`, `Array`, `Object`
- `Date`, `Function`, `Symbol`, `Error`
- 自定义类（使用 `instanceof`）

```ts
class Person {
  constructor(public name: string) {}
}

defineProps({
  author: Person // instanceof 检查
})
```

## 可空 Props

```ts
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

## 布尔类型转换

布尔 props 有特殊的转换规则：

```vue
<script setup lang="ts">
defineProps({
  disabled: Boolean
})
</script>

<!-- 等价于 :disabled="true" -->
<MyComponent disabled />

<!-- 等价于 :disabled="false" -->
<MyComponent />
```

## 单向数据流

Props 形成单向绑定：父组件 → 子组件。永远不要直接修改 props。

```ts
const props = defineProps(['initialCounter'])

// ❌ 不要修改 props
props.initialCounter = 5

// ✅ 使用从 prop 初始化的本地状态
const counter = ref(props.initialCounter)

// ✅ 或使用计算属性进行转换
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```

## 传递 Props

```vue-html
<!-- 静态 -->
<BlogPost title="My Post" />

<!-- 动态 -->
<BlogPost :title="post.title" />

<!-- 数字（需要 v-bind） -->
<BlogPost :likes="42" />

<!-- 布尔值 -->
<BlogPost is-published />
<BlogPost :is-published="false" />

<!-- 对象展开 -->
<BlogPost v-bind="post" />
<!-- 等价于 -->
<BlogPost :id="post.id" :title="post.title" />
```

## Props 命名规范

- 在 JavaScript 中使用 camelCase 声明
- 在模板中使用 kebab-case

```ts
defineProps({
  greetingMessage: String
})
```

```vue-html
<MyComponent greeting-message="hello" />
```

<!-- 
Source references:
- https://vuejs.org/guide/components/props.html
- https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
-->
