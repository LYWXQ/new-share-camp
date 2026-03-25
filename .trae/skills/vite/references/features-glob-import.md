---
name: features-glob-import
description: Vite 的 import.meta.glob 用于批量导入模块和动态导入
---

# Glob 导入

## 基本用法

使用 glob 模式导入多个模块：

```ts
const modules = import.meta.glob('./dir/*.js')
// 转换为：
// {
//   './dir/foo.js': () => import('./dir/foo.js'),
//   './dir/bar.js': () => import('./dir/bar.js'),
// }
```

迭代并加载：

```ts
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

## 立即加载

立即加载所有模块（无动态导入）：

```ts
const modules = import.meta.glob('./dir/*.js', { eager: true })
// 转换为：
// import * as __glob_0 from './dir/foo.js'
// import * as __glob_1 from './dir/bar.js'
// const modules = {
//   './dir/foo.js': __glob_0,
//   './dir/bar.js': __glob_1,
// }
```

## 多个模式

```ts
const modules = import.meta.glob([
  './dir/*.js',
  './another/*.js'
])
```

## 否定模式

使用 `!` 前缀排除文件：

```ts
const modules = import.meta.glob([
  './dir/*.js',
  '!**/bar.js'  // 排除 bar.js
])
```

## 命名导入

导入特定导出以进行 tree-shaking：

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup'
})
// './dir/foo.js': () => import('./dir/foo.js').then(m => m.setup)
```

导入默认导出：

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true
})
```

## 自定义查询

作为原始字符串或 URL 导入：

```ts
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default'
})

const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default'
})
```

插件的自定义查询：

```ts
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})
```

## 基础路径

更改导入的基础路径：

```ts
const modules = import.meta.glob('./**/*.js', {
  base: './base'
})
// 键: './dir/foo.js'
// 导入: './base/dir/foo.js'
```

## 重要注意事项

1. **Vite 专用功能** - 不是 Web 标准
2. **模式必须是字面量** - 不能使用变量
3. **相对或绝对** - 必须以 `./`、`/` 开头或使用别名
4. **Glob 匹配** - 使用 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby)

## 带变量的动态导入

有限的动态导入支持：

```ts
const module = await import(`./dir/${file}.js`)
```

**规则：**
- 必须以 `./` 或 `../` 开头
- 必须以文件扩展名结尾
- 变量仅代表一个级别（无 `foo/bar`）
- 自己的目录需要文件名模式：`./prefix-${foo}.js` 而非 `./${foo}.js`

## 实际示例：加载路由组件

```ts
// 懒加载所有页面组件
const pages = import.meta.glob('./pages/*.vue')

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.vue$/)[1]
  return {
    path: `/${name.toLowerCase()}`,
    component: pages[path]  // 懒加载
  }
})
```

<!-- 
Source references:
- https://vite.dev/guide/features.html#glob-import
-->
