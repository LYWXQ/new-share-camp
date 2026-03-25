---
category: 状态
---

# useSessionStorage

响应式 [SessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)。

## 用法

请参阅 `useStorage`。

## 类型声明

```ts
export declare function useSessionStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>
export declare function useSessionStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>
export declare function useSessionStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>
export declare function useSessionStorage<T>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
export declare function useSessionStorage<T = unknown>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
```
