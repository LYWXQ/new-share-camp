---
category: 工具
---

# useToggle

带工具函数的布尔切换器。

## 用法

```ts
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
```

当您传递一个 ref 时，`useToggle` 将返回一个简单的切换函数：

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

注意：请注意切换函数接受第一个参数作为覆盖值。您可能希望避免直接将函数传递给模板中的事件，因为事件对象将被传入。

```html
<!-- 注意：$event 将被传入 -->
<button @click="toggleDark" />
<!-- 推荐这样做 -->
<button @click="toggleDark()" />
```

## 类型声明

```ts
export type ToggleFn = (value?: boolean) => void
export type UseToggleReturn = [ShallowRef<boolean>, ToggleFn] | ToggleFn
export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeRefOrGetter<Truthy>
  falsyValue?: MaybeRefOrGetter<Falsy>
}
export declare function useToggle<Truthy, Falsy, T = Truthy | Falsy>(
  initialValue: Ref<T>,
  options?: UseToggleOptions<Truthy, Falsy>,
): (value?: T) => T
export declare function useToggle<
  Truthy = true,
  Falsy = false,
  T = Truthy | Falsy,
>(
  initialValue?: T,
  options?: UseToggleOptions<Truthy, Falsy>,
): [ShallowRef<T>, (value?: T) => T]
```
