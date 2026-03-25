---
title: 只在 Mounted 钩子后访问 DOM
impact: HIGH
impactDescription: 在 mounted 之前访问 DOM 元素会导致未定义错误和静默失败
type: capability
tags: [vue3, vue2, lifecycle, dom, mounted, created, beforeMount, template-refs]
---

# 只在 Mounted 钩子后访问 DOM

**影响：高** - 在 `created` 或 `beforeMount` 钩子中尝试访问 DOM 元素或 `this.$el` 会失败，因为组件的模板尚未渲染到 DOM。这会导致未定义错误、空引用和第三方库初始化失败。

组件的 DOM 只在 `mounted` 钩子（Options API）或 `onMounted` 运行后（Composition API）才可用。在此之前，`this.$el` 是未定义的，模板引用是 null。

## 任务清单

- [ ] 只在 `mounted`/`onMounted` 或之后执行 DOM 操作
- [ ] 在 mounted 中初始化依赖 DOM 的库（图表、地图、编辑器）
- [ ] 使用 `created` 进行数据初始化和 API 调用（非 DOM 操作）
- [ ] 只在 mounted 后访问模板引用
- [ ] 如果需要在响应式数据更改后访问 DOM，使用 `$nextTick`

**错误示例：**
```javascript
// 错误：在 created 钩子中访问 DOM
export default {
  created() {
    // DOM 还不存在！
    console.log(this.$el) // undefined
    this.$el.querySelector('.chart') // 错误：无法读取 undefined 的属性 'querySelector'

    // 第三方库初始化失败
    new Chart(document.getElementById('myChart')) // 元素还不存在
  }
}
```

```javascript
// 错误：在 beforeMount 中访问 DOM
export default {
  beforeMount() {
    // 仍然太早 - 模板已编译但未挂载
    console.log(this.$el) // 在 Vue 3 中是 undefined
    this.$refs.myInput.focus() // 错误：无法读取 undefined 的属性 'focus'
  }
}
```

```vue
<!-- 错误：在 setup 中同步访问模板引用 -->
<script setup>
import { ref } from 'vue'

const myInput = ref(null)

// 这在 setup 期间运行，在挂载之前
myInput.value.focus() // 错误：无法读取 null 的属性 'focus'
</script>

<template>
  <input ref="myInput" />
</template>
```

**正确示例：**
```javascript
// 正确：使用 created 处理数据，mounted 处理 DOM
export default {
  data() {
    return { chartData: null }
  },
  async created() {
    // 在 created 中获取数据是可以的
    this.chartData = await fetchChartData()
  },
  mounted() {
    // 现在 DOM 存在且可以安全访问
    console.log(this.$el) // <div>...</div>

    // 初始化依赖 DOM 的库
    this.chart = new Chart(this.$refs.chartCanvas, {
      data: this.chartData
    })
  }
}
```

```vue
<!-- 正确：在 onMounted 中访问模板引用 -->
<script setup>
import { ref, onMounted } from 'vue'

const myInput = ref(null)

onMounted(() => {
  // DOM 现在可用
  myInput.value.focus() // 有效！
})
</script>

<template>
  <input ref="myInput" />
</template>
```

```javascript
// 正确：使用 $nextTick 在数据更改后访问 DOM
export default {
  methods: {
    async addItem() {
      this.items.push(newItem)

      // 等待 Vue 更新 DOM
      await this.$nextTick()

      // 现在新元素存在于 DOM 中
      this.$refs.list.lastElementChild.scrollIntoView()
    }
  }
}
```

## Vue 3 Composition API 模式

```vue
<script setup>
import { ref, onMounted, nextTick } from 'vue'

const listRef = ref(null)
const items = ref([])

onMounted(() => {
  // 在这里访问 DOM 是安全的
  listRef.value.style.height = '400px'
})
</script>
```

## Vue 3.5+ useTemplateRef 模式

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// Vue 3.5+ 推荐方法 - 将 ref 名称与变量名解耦
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

## Composition API with nextTick

```vue
<script setup>
import { ref, nextTick } from 'vue'

const listRef = ref(null)
const items = ref([])

async function addItem(item) {
  items.value.push(item)

  // 等待响应式更改后的 DOM 更新
  await nextTick()

  // 现在新项在 DOM 中
  listRef.value.lastElementChild.focus()
}
</script>

<template>
  <ul ref="listRef">
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

## 常见第三方库

```javascript
// 正确：在 mounted 中初始化
export default {
  mounted() {
    // Chart.js
    this.chart = new Chart(this.$refs.canvas, config)

    // Leaflet 地图
    this.map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 13)

    // Monaco Editor
    this.editor = monaco.editor.create(this.$refs.editorContainer, options)

    // Video.js
    this.player = videojs(this.$refs.videoElement)
  },
  beforeUnmount() {
    // 别忘了清理！
    this.chart?.destroy()
    this.map?.remove()
    this.editor?.dispose()
    this.player?.dispose()
  }
}
```

## 参考
- [Vue.js 生命周期钩子](https://vuejs.org/guide/essentials/lifecycle.html)
- [Vue.js 模板引用](https://vuejs.org/guide/essentials/template-refs.html)
- [Vue.js nextTick](https://vuejs.org/api/general.html#nexttick)
