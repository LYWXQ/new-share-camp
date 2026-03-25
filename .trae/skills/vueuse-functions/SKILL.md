---
name: vueuse-functions
description: 在适当的地方应用 VueUse 组合式函数来构建简洁、可维护的 Vue.js / Nuxt 功能。做什么：为 Vue.js / Nuxt 项目提供 VueUse 组合式函数的决策和实施指南。何时调用：在协助用户进行 Vue.js / Nuxt 开发工作时，优先检查是否可以使用 VueUse 函数实现需求。
license: MIT
metadata:
    author: SerKo <https://github.com/serkodev>
    version: "1.1"
compatibility: 需要 Vue 3（或更高版本）或 Nuxt 3（或更高版本）项目
---

# VueUse 函数

本技能是 Vue.js / Nuxt 项目中 VueUse 组合式函数的决策和实施指南。它将需求映射到最适合的 VueUse 函数，应用正确的使用模式，并优先选择基于组合式函数的解决方案而非定制代码，以保持实现的简洁、可维护和高性能。

## 何时应用

- 在协助用户进行 Vue.js / Nuxt 开发工作时应用此技能。
- 始终首先检查是否可以使用 VueUse 函数实现需求。
- 优先选择 VueUse 组合式函数而非自定义代码，以提高可读性、可维护性和性能。
- 将需求映射到最合适的 VueUse 函数，并遵循该函数的调用规则。
- 请参阅下方函数表中的 `调用方式` 字段。例如：
  - `AUTO`：适用时自动使用。
  - `EXTERNAL`：仅当用户已安装所需外部依赖时使用；否则重新考虑，仅在真正需要时才要求安装。
  - `EXPLICIT_ONLY`：仅在用户明确要求时使用。
  > *注意*：提示中的用户指令或 `AGENTS.md` 可能会覆盖函数的默认 `调用方式` 规则。

## 函数

以下列出的所有函数都是 [VueUse](https://vueuse.org/) 库的一部分，每个部分根据功能对函数进行分类。

重要：每个函数条目包含简短的 `描述` 和详细的 `参考`。使用任何函数时，请务必查阅 `./references` 目录中的相应文档以了解使用详情和类型声明。

### 状态

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`createGlobalState`](references/createGlobalState.md) | 将状态保持在全局范围内，以便在多个 Vue 实例之间复用 | AUTO |
| [`createInjectionState`](references/createInjectionState.md) | 创建可注入到组件中的全局状态 | AUTO |
| [`createSharedComposable`](references/createSharedComposable.md) | 使组合式函数可在多个 Vue 实例中使用 | AUTO |
| [`injectLocal`](references/injectLocal.md) | 扩展的 `inject`，能够在同一组件中调用 `provideLocal` 来提供值 | AUTO |
| [`provideLocal`](references/provideLocal.md) | 扩展的 `provide`，能够在同一组件中调用 `injectLocal` 来获取值 | AUTO |
| [`useAsyncState`](references/useAsyncState.md) | 响应式异步状态 | AUTO |
| [`useDebouncedRefHistory`](references/useDebouncedRefHistory.md) | 带有防抖过滤器的 `useRefHistory` 简写 | AUTO |
| [`useLastChanged`](references/useLastChanged.md) | 记录最后更改的时间戳 | AUTO |
| [`useLocalStorage`](references/useLocalStorage.md) | 响应式 [LocalStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) | AUTO |
| [`useManualRefHistory`](references/useManualRefHistory.md) | 当用户调用 `commit()` 时手动跟踪 ref 的更改历史 | AUTO |
| [`useRefHistory`](references/useRefHistory.md) | 跟踪 ref 的更改历史 | AUTO |
| [`useSessionStorage`](references/useSessionStorage.md) | 响应式 [SessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) | AUTO |
| [`useStorage`](references/useStorage.md) | 创建响应式 ref，可用于访问和修改 [LocalStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 或 [SessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) | AUTO |
| [`useStorageAsync`](references/useStorageAsync.md) | 支持异步的响应式存储 | AUTO |
| [`useThrottledRefHistory`](references/useThrottledRefHistory.md) | 带有节流过滤器的 `useRefHistory` 简写 | AUTO |

### 元素

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useActiveElement`](references/useActiveElement.md) | 响应式 `document.activeElement` | AUTO |
| [`useDocumentVisibility`](references/useDocumentVisibility.md) | 响应式跟踪 [`document.visibilityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/visibilityState) | AUTO |
| [`useDraggable`](references/useDraggable.md) | 使元素可拖动 | AUTO |
| [`useDropZone`](references/useDropZone.md) | 创建可放置文件的区域 | AUTO |
| [`useElementBounding`](references/useElementBounding.md) | HTML 元素的响应式 [边界框](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) | AUTO |
| [`useElementSize`](references/useElementSize.md) | HTML 元素的响应式大小 | AUTO |
| [`useElementVisibility`](references/useElementVisibility.md) | 跟踪元素在视口中的可见性 | AUTO |
| [`useIntersectionObserver`](references/useIntersectionObserver.md) | 检测目标元素的可见性 | AUTO |
| [`useMouseInElement`](references/useMouseInElement.md) | 相对于元素的响应式鼠标位置 | AUTO |
| [`useMutationObserver`](references/useMutationObserver.md) | 监视对 DOM 树所做的更改 | AUTO |
| [`useParentElement`](references/useParentElement.md) | 获取给定元素的父元素 | AUTO |
| [`useResizeObserver`](references/useResizeObserver.md) | 报告元素内容或边框盒的尺寸变化 | AUTO |
| [`useWindowFocus`](references/useWindowFocus.md) | 使用 `window.onfocus` 和 `window.onblur` 事件响应式跟踪窗口焦点 | AUTO |
| [`useWindowScroll`](references/useWindowScroll.md) | 响应式窗口滚动 | AUTO |
| [`useWindowSize`](references/useWindowSize.md) | 响应式窗口大小 | AUTO |

### 浏览器

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useBluetooth`](references/useBluetooth.md) | 响应式 [Web Bluetooth API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Bluetooth_API) | AUTO |
| [`useBreakpoints`](references/useBreakpoints.md) | 响应式视口断点 | AUTO |
| [`useBroadcastChannel`](references/useBroadcastChannel.md) | 响应式 [BroadcastChannel API](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel) | AUTO |
| [`useBrowserLocation`](references/useBrowserLocation.md) | 响应式浏览器位置 | AUTO |
| [`useClipboard`](references/useClipboard.md) | 响应式 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) | AUTO |
| [`useClipboardItems`](references/useClipboardItems.md) | 响应式 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) | AUTO |
| [`useColorMode`](references/useColorMode.md) | 响应式颜色模式（深色 / 浅色 / 自定义）并自动持久化数据 | AUTO |
| [`useCssVar`](references/useCssVar.md) | 操作 CSS 变量 | AUTO |
| [`useDark`](references/useDark.md) | 响应式深色模式并自动持久化数据 | AUTO |
| [`useEventListener`](references/useEventListener.md) | 轻松使用 EventListener | AUTO |
| [`useEyeDropper`](references/useEyeDropper.md) | 响应式 [EyeDropper API](https://developer.mozilla.org/zh-CN/docs/Web/API/EyeDropper_API) | AUTO |
| [`useFavicon`](references/useFavicon.md) | 响应式网站图标 | AUTO |
| [`useFileDialog`](references/useFileDialog.md) | 轻松打开文件对话框 | AUTO |
| [`useFileSystemAccess`](references/useFileSystemAccess.md) | 使用 [FileSystemAccessAPI](https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_Access_API) 创建、读取和写入本地文件 | AUTO |
| [`useFullscreen`](references/useFullscreen.md) | 响应式 [Fullscreen API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API) | AUTO |
| [`useGamepad`](references/useGamepad.md) | 为 [Gamepad API](https://developer.mozilla.org/zh-CN/docs/Web/API/Gamepad_API) 提供响应式绑定 | AUTO |
| [`useImage`](references/useImage.md) | 在浏览器中响应式加载图片 | AUTO |
| [`useMediaControls`](references/useMediaControls.md) | `audio` 和 `video` 元素的响应式媒体控制 | AUTO |
| [`useMediaQuery`](references/useMediaQuery.md) | 响应式 [媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries/Testing_media_queries) | AUTO |
| [`useMemory`](references/useMemory.md) | 响应式内存信息 | AUTO |
| [`useObjectUrl`](references/useObjectUrl.md) | 响应式表示对象的 URL | AUTO |
| [`usePerformanceObserver`](references/usePerformanceObserver.md) | 观察性能指标 | AUTO |
| [`usePermission`](references/usePermission.md) | 响应式 [Permissions API](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API) | AUTO |
| [`usePreferredColorScheme`](references/usePreferredColorScheme.md) | 响应式 [prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme) 媒体查询 | AUTO |
| [`usePreferredContrast`](references/usePreferredContrast.md) | 响应式 [prefers-contrast](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-contrast) 媒体查询 | AUTO |
| [`usePreferredDark`](references/usePreferredDark.md) | 响应式深色主题偏好 | AUTO |
| [`usePreferredLanguages`](references/usePreferredLanguages.md) | 响应式 [Navigator Languages](https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorLanguage/languages) | AUTO |
| [`usePreferredReducedMotion`](references/usePreferredReducedMotion.md) | 响应式 [prefers-reduced-motion](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-reduced-motion) 媒体查询 | AUTO |
| [`usePreferredReducedTransparency`](references/usePreferredReducedTransparency.md) | 响应式 [prefers-reduced-transparency](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-reduced-transparency) 媒体查询 | AUTO |
| [`useScreenOrientation`](references/useScreenOrientation.md) | 响应式 [Screen Orientation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen_Orientation_API) | AUTO |
| [`useScreenSafeArea`](references/useScreenSafeArea.md) | 响应式 `env(safe-area-inset-*)` | AUTO |
| [`useScriptTag`](references/useScriptTag.md) | 创建 script 标签 | AUTO |
| [`useShare`](references/useShare.md) | 响应式 [Web Share API](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/share) | AUTO |
| [`useSSRWidth`](references/useSSRWidth.md) | 用于设置全局视口宽度，在渲染依赖视口宽度的 SSR 组件时使用，如 [`useMediaQuery`](../useMediaQuery/index.md) 或 [`useBreakpoints`](../useBreakpoints/index.md) | AUTO |
| [`useStyleTag`](references/useStyleTag.md) | 在 head 中注入响应式 `style` 元素 | AUTO |
| [`useTextareaAutosize`](references/useTextareaAutosize.md) | 根据内容自动更新 textarea 的高度 | AUTO |
| [`useTextDirection`](references/useTextDirection.md) | 响应式元素文本的 [dir](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/dir) | AUTO |
| [`useTitle`](references/useTitle.md) | 响应式文档标题 | AUTO |
| [`useUrlSearchParams`](references/useUrlSearchParams.md) | 响应式 [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) | AUTO |
| [`useVibrate`](references/useVibrate.md) | 响应式 [Vibration API](https://developer.mozilla.org/zh-CN/docs/Web/API/Vibration_API) | AUTO |
| [`useWakeLock`](references/useWakeLock.md) | 响应式 [Screen Wake Lock API](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen_Wake_Lock_API) | AUTO |
| [`useWebNotification`](references/useWebNotification.md) | 响应式 [Notification](https://developer.mozilla.org/zh-CN/docs/Web/API/notification) | AUTO |
| [`useWebWorker`](references/useWebWorker.md) | 简单的 [Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers) 注册和通信 | AUTO |
| [`useWebWorkerFn`](references/useWebWorkerFn.md) | 在不阻塞 UI 的情况下运行昂贵的函数 | AUTO |

### 传感器

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`onClickOutside`](references/onClickOutside.md) | 监听元素外部的点击 | AUTO |
| [`onElementRemoval`](references/onElementRemoval.md) | 当元素或包含它的任何元素被移除时触发 | AUTO |
| [`onKeyStroke`](references/onKeyStroke.md) | 监听键盘按键 | AUTO |
| [`onLongPress`](references/onLongPress.md) | 监听元素上的长按 | AUTO |
| [`onStartTyping`](references/onStartTyping.md) | 当用户在非可编辑元素上开始输入时触发 | AUTO |
| [`useBattery`](references/useBattery.md) | 响应式 [Battery Status API](https://developer.mozilla.org/zh-CN/docs/Web/API/Battery_Status_API) | AUTO |
| [`useDeviceMotion`](references/useDeviceMotion.md) | 响应式 [DeviceMotionEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/DeviceMotionEvent) | AUTO |
| [`useDeviceOrientation`](references/useDeviceOrientation.md) | 响应式 [DeviceOrientationEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/DeviceOrientationEvent) | AUTO |
| [`useDevicePixelRatio`](references/useDevicePixelRatio.md) | 响应式跟踪 [`window.devicePixelRatio`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/devicePixelRatio) | AUTO |
| [`useDevicesList`](references/useDevicesList.md) | 响应式 [enumerateDevices](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices) 列出可用的输入/输出设备 | AUTO |
| [`useDisplayMedia`](references/useDisplayMedia.md) | 响应式 [`mediaDevices.getDisplayMedia`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia) 流 | AUTO |
| [`useElementByPoint`](references/useElementByPoint.md) | 响应式根据点获取元素 | AUTO |
| [`useElementHover`](references/useElementHover.md) | 响应式元素的悬停状态 | AUTO |
| [`useFocus`](references/useFocus.md) | 响应式工具，用于跟踪或设置 DOM 元素的焦点状态 | AUTO |
| [`useFocusWithin`](references/useFocusWithin.md) | 响应式工具，用于跟踪元素或其子元素是否具有焦点 | AUTO |
| [`useFps`](references/useFps.md) | 响应式 FPS（每秒帧数） | AUTO |
| [`useGeolocation`](references/useGeolocation.md) | 响应式 [Geolocation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API) | AUTO |
| [`useIdle`](references/useIdle.md) | 跟踪用户是否处于非活动状态 | AUTO |
| [`useInfiniteScroll`](references/useInfiniteScroll.md) | 元素的无限滚动 | AUTO |
| [`useKeyModifier`](references/useKeyModifier.md) | 响应式 [Modifier State](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/getModifierState) | AUTO |
| [`useMagicKeys`](references/useMagicKeys.md) | 响应式按键状态 | AUTO |
| [`useMouse`](references/useMouse.md) | 响应式鼠标位置 | AUTO |
| [`useMousePressed`](references/useMousePressed.md) | 响应式鼠标按下状态 | AUTO |
| [`useNavigatorLanguage`](references/useNavigatorLanguage.md) | 响应式 [navigator.language](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/language) | AUTO |
| [`useNetwork`](references/useNetwork.md) | 响应式 [网络状态](https://developer.mozilla.org/zh-CN/docs/Web/API/Network_Information_API) | AUTO |
| [`useOnline`](references/useOnline.md) | 响应式在线状态 | AUTO |
| [`usePageLeave`](references/usePageLeave.md) | 响应式状态，显示鼠标是否离开页面 | AUTO |
| [`useParallax`](references/useParallax.md) | 轻松创建视差效果 | AUTO |
| [`usePointer`](references/usePointer.md) | 响应式 [指针状态](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events) | AUTO |
| [`usePointerLock`](references/usePointerLock.md) | 响应式 [指针锁定](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_Lock_API) | AUTO |
| [`usePointerSwipe`](references/usePointerSwipe.md) | 基于 [PointerEvents](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent) 的响应式滑动手势检测 | AUTO |
| [`useScroll`](references/useScroll.md) | 响应式滚动位置和状态 | AUTO |
| [`useScrollLock`](references/useScrollLock.md) | 锁定元素的滚动 | AUTO |
| [`useSpeechRecognition`](references/useSpeechRecognition.md) | 响应式 [SpeechRecognition](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognition) | AUTO |
| [`useSpeechSynthesis`](references/useSpeechSynthesis.md) | 响应式 [SpeechSynthesis](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesis) | AUTO |
| [`useSwipe`](references/useSwipe.md) | 基于 [`TouchEvents`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent) 的响应式滑动手势检测 | AUTO |
| [`useTextSelection`](references/useTextSelection.md) | 基于 [`Window.getSelection`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getSelection) 响应式跟踪用户文本选择 | AUTO |
| [`useUserMedia`](references/useUserMedia.md) | 响应式 [`mediaDevices.getUserMedia`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia) 流 | AUTO |

### 网络

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useEventSource`](references/useEventSource.md) | [EventSource](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource) 或 [Server-Sent-Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events) 实例打开与 HTTP 服务器的持久连接 | AUTO |
| [`useFetch`](references/useFetch.md) | 响应式 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 提供中止请求的能力 | AUTO |
| [`useWebSocket`](references/useWebSocket.md) | 响应式 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/WebSocket) 客户端 | AUTO |

### 动画

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useAnimate`](references/useAnimate.md) | 响应式 [Web Animations API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API) | AUTO |
| [`useInterval`](references/useInterval.md) | 每个间隔增加的响应式计数器 | AUTO |
| [`useIntervalFn`](references/useIntervalFn.md) | 带控制的 `setInterval` 包装器 | AUTO |
| [`useNow`](references/useNow.md) | 响应式当前 Date 实例 | AUTO |
| [`useRafFn`](references/useRafFn.md) | 在每个 `requestAnimationFrame` 上调用函数 | AUTO |
| [`useTimeout`](references/useTimeout.md) | 在给定时间后更新值并带控制 | AUTO |
| [`useTimeoutFn`](references/useTimeoutFn.md) | 带控制的 `setTimeout` 包装器 | AUTO |
| [`useTimestamp`](references/useTimestamp.md) | 响应式当前时间戳 | AUTO |
| [`useTransition`](references/useTransition.md) | 值之间的过渡 | AUTO |

### 组件

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`computedInject`](references/computedInject.md) | 组合 computed 和 inject | AUTO |
| [`createReusableTemplate`](references/createReusableTemplate.md) | 在组件范围内定义和复用模板 | AUTO |
| [`createTemplatePromise`](references/createTemplatePromise.md) | 模板作为 Promise | AUTO |
| [`templateRef`](references/templateRef.md) | 绑定 ref 到模板元素的简写 | AUTO |
| [`tryOnBeforeMount`](references/tryOnBeforeMount.md) | 安全的 `onBeforeMount` | AUTO |
| [`tryOnBeforeUnmount`](references/tryOnBeforeUnmount.md) | 安全的 `onBeforeUnmount` | AUTO |
| [`tryOnMounted`](references/tryOnMounted.md) | 安全的 `onMounted` | AUTO |
| [`tryOnScopeDispose`](references/tryOnScopeDispose.md) | 安全的 `onScopeDispose` | AUTO |
| [`tryOnUnmounted`](references/tryOnUnmounted.md) | 安全的 `onUnmounted` | AUTO |
| [`unrefElement`](references/unrefElement.md) | 从 Vue ref 或组件实例检索底层 DOM 元素 | AUTO |
| [`useCurrentElement`](references/useCurrentElement.md) | 将当前组件的 DOM 元素作为 ref 获取 | AUTO |
| [`useMounted`](references/useMounted.md) | ref 中的挂载状态 | AUTO |
| [`useTemplateRefsList`](references/useTemplateRefsList.md) | 在 `v-for` 中绑定 refs 到模板元素和组件的简写 | AUTO |
| [`useVirtualList`](references/useVirtualList.md) | 轻松创建虚拟列表 | AUTO |
| [`useVModel`](references/useVModel.md) | v-model 绑定的简写 | AUTO |
| [`useVModels`](references/useVModels.md) | props v-model 绑定的简写 | AUTO |

### 监听

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`until`](references/until.md) | 承诺一次性监听更改 | AUTO |
| [`watchArray`](references/watchArray.md) | 监听数组的添加和删除 | AUTO |
| [`watchAtMost`](references/watchAtMost.md) | 带触发次数限制的 `watch` | AUTO |
| [`watchDebounced`](references/watchDebounced.md) | 防抖监听 | AUTO |
| [`watchDeep`](references/watchDeep.md) | 使用 `{deep: true}` 监听值的简写 | AUTO |
| [`watchIgnorable`](references/watchIgnorable.md) | 可忽略的监听 | AUTO |
| [`watchImmediate`](references/watchImmediate.md) | 使用 `{immediate: true}` 监听值的简写 | AUTO |
| [`watchOnce`](references/watchOnce.md) | 使用 `{ once: true }` 监听值的简写 | AUTO |
| [`watchPausable`](references/watchPausable.md) | 可暂停的监听 | AUTO |
| [`watchThrottled`](references/watchThrottled.md) | 节流监听 | AUTO |
| [`watchTriggerable`](references/watchTriggerable.md) | 可手动触发的监听 | AUTO |
| [`watchWithFilter`](references/watchWithFilter.md) | 带额外 EventFilter 控制的 `watch` | AUTO |
| [`whenever`](references/whenever.md) | 监听值为真值的简写 | AUTO |

### 响应式

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`computedAsync`](references/computedAsync.md) | 异步函数的 computed | AUTO |
| [`computedEager`](references/computedEager.md) | 无惰性求值的即时 computed | AUTO |
| [`computedWithControl`](references/computedWithControl.md) | 显式定义 computed 的依赖 | AUTO |
| [`createRef`](references/createRef.md) | 根据 `deep` 参数返回 `deepRef` 或 `shallowRef` | AUTO |
| [`extendRef`](references/extendRef.md) | 为 Ref 添加额外属性 | AUTO |
| [`reactify`](references/reactify.md) | 将普通函数转换为响应式函数 | AUTO |
| [`reactifyObject`](references/reactifyObject.md) | 对对象应用 `reactify` | AUTO |
| [`reactiveComputed`](references/reactiveComputed.md) | 响应式 computed 对象 | AUTO |
| [`reactiveOmit`](references/reactiveOmit.md) | 响应式地从响应式对象中省略字段 | AUTO |
| [`reactivePick`](references/reactivePick.md) | 响应式地从响应式对象中选取字段 | AUTO |
| [`refAutoReset`](references/refAutoReset.md) | 在一段时间后重置为默认值的 ref | AUTO |
| [`refDebounced`](references/refDebounced.md) | 防抖执行 ref 值 | AUTO |
| [`refDefault`](references/refDefault.md) | 为 ref 应用默认值 | AUTO |
| [`refManualReset`](references/refManualReset.md) | 创建带手动重置功能的 ref | AUTO |
| [`refThrottled`](references/refThrottled.md) | 节流更改 ref 值 | AUTO |
| [`refWithControl`](references/refWithControl.md) | 对 ref 及其响应性的细粒度控制 | AUTO |
| [`syncRef`](references/syncRef.md) | 双向 ref 同步 | AUTO |
| [`syncRefs`](references/syncRefs.md) | 保持目标 refs 与源 ref 同步 | AUTO |
| [`toReactive`](references/toReactive.md) | 将 ref 转换为 reactive | AUTO |
| [`toRef`](references/toRef.md) | 将值/ref/getter 规范化为 `ref` 或 `computed` | EXPLICIT_ONLY |
| [`toRefs`](references/toRefs.md) | 扩展的 [`toRefs`](https://vuejs.org/api/reactivity-utilities.html#torefs)，也接受对象的 refs | AUTO |

### 数组

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useArrayDifference`](references/useArrayDifference.md) | 响应式获取两个数组的差异 | AUTO |
| [`useArrayEvery`](references/useArrayEvery.md) | 响应式 `Array.every` | AUTO |
| [`useArrayFilter`](references/useArrayFilter.md) | 响应式 `Array.filter` | AUTO |
| [`useArrayFind`](references/useArrayFind.md) | 响应式 `Array.find` | AUTO |
| [`useArrayFindIndex`](references/useArrayFindIndex.md) | 响应式 `Array.findIndex` | AUTO |
| [`useArrayFindLast`](references/useArrayFindLast.md) | 响应式 `Array.findLast` | AUTO |
| [`useArrayIncludes`](references/useArrayIncludes.md) | 响应式 `Array.includes` | AUTO |
| [`useArrayJoin`](references/useArrayJoin.md) | 响应式 `Array.join` | AUTO |
| [`useArrayMap`](references/useArrayMap.md) | 响应式 `Array.map` | AUTO |
| [`useArrayReduce`](references/useArrayReduce.md) | 响应式 `Array.reduce` | AUTO |
| [`useArraySome`](references/useArraySome.md) | 响应式 `Array.some` | AUTO |
| [`useArrayUnique`](references/useArrayUnique.md) | 响应式唯一数组 | AUTO |
| [`useSorted`](references/useSorted.md) | 响应式排序数组 | AUTO |

### 时间

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useCountdown`](references/useCountdown.md) | `useIntervalFn` 的包装器，提供倒计时计时器 | AUTO |
| [`useDateFormat`](references/useDateFormat.md) | 根据传入的标记字符串获取格式化日期 | AUTO |
| [`useTimeAgo`](references/useTimeAgo.md) | 响应式相对时间 | AUTO |
| [`useTimeAgoIntl`](references/useTimeAgoIntl.md) | 支持 i18n 的响应式相对时间 | AUTO |

### 工具

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`createEventHook`](references/createEventHook.md) | 创建事件钩子的工具 | AUTO |
| [`createUnrefFn`](references/createUnrefFn.md) | 使普通函数接受 ref 和原始值作为参数 | AUTO |
| [`get`](references/get.md) | 访问 `ref.value` 的简写 | EXPLICIT_ONLY |
| [`isDefined`](references/isDefined.md) | Ref 的非空检查类型守卫 | AUTO |
| [`makeDestructurable`](references/makeDestructurable.md) | 使对象和数组同时可同构解构 | AUTO |
| [`set`](references/set.md) | `ref.value = x` 的简写 | EXPLICIT_ONLY |
| [`useAsyncQueue`](references/useAsyncQueue.md) | 顺序执行每个异步任务并将当前任务结果传递给下一个任务 | AUTO |
| [`useBase64`](references/useBase64.md) | 响应式 base64 转换 | AUTO |
| [`useCached`](references/useCached.md) | 使用自定义比较器缓存 ref | AUTO |
| [`useCloned`](references/useCloned.md) | ref 的响应式克隆 | AUTO |
| [`useConfirmDialog`](references/useConfirmDialog.md) | 创建事件钩子以支持模态框和确认对话框链 | AUTO |
| [`useCounter`](references/useCounter.md) | 带工具函数的基础计数器 | AUTO |
| [`useCycleList`](references/useCycleList.md) | 循环遍历项目列表 | AUTO |
| [`useDebounceFn`](references/useDebounceFn.md) | 防抖执行函数 | AUTO |
| [`useEventBus`](references/useEventBus.md) | 基础事件总线 | AUTO |
| [`useMemoize`](references/useMemoize.md) | 根据参数缓存函数结果并保持响应式 | AUTO |
| [`useOffsetPagination`](references/useOffsetPagination.md) | 响应式偏移分页 | AUTO |
| [`usePrevious`](references/usePrevious.md) | 保存 ref 的前一个值 | AUTO |
| [`useStepper`](references/useStepper.md) | 为构建多步骤向导界面提供辅助 | AUTO |
| [`useSupported`](references/useSupported.md) | SSR 兼容性 `isSupported` | AUTO |
| [`useThrottleFn`](references/useThrottleFn.md) | 节流执行函数 | AUTO |
| [`useTimeoutPoll`](references/useTimeoutPoll.md) | 使用超时轮询某些内容 | AUTO |
| [`useToggle`](references/useToggle.md) | 带工具函数的布尔切换器 | AUTO |
| [`useToNumber`](references/useToNumber.md) | 响应式将字符串 ref 转换为数字 | AUTO |
| [`useToString`](references/useToString.md) | 响应式将 ref 转换为字符串 | AUTO |

### @Electron

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useIpcRenderer`](references/useIpcRenderer.md) | 提供 [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) 及其所有 API | EXTERNAL |
| [`useIpcRendererInvoke`](references/useIpcRendererInvoke.md) | 响应式 [ipcRenderer.invoke API](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args) 结果 | EXTERNAL |
| [`useIpcRendererOn`](references/useIpcRendererOn.md) | 轻松使用 [ipcRenderer.on](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener) 并在卸载时自动 [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) | EXTERNAL |
| [`useZoomFactor`](references/useZoomFactor.md) | 响应式 [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) 缩放因子 | EXTERNAL |
| [`useZoomLevel`](references/useZoomLevel.md) | 响应式 [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) 缩放级别 | EXTERNAL |

### @Firebase

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useAuth`](references/useAuth.md) | 响应式 [Firebase Auth](https://firebase.google.com/docs/auth) 绑定 | EXTERNAL |
| [`useFirestore`](references/useFirestore.md) | 响应式 [Firestore](https://firebase.google.com/docs/firestore) 绑定 | EXTERNAL |
| [`useRTDB`](references/useRTDB.md) | 响应式 [Firebase Realtime Database](https://firebase.google.com/docs/database) 绑定 | EXTERNAL |

### @Head

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`createHead`](https://github.com/vueuse/head#api) | 创建 head 管理器实例。 | EXTERNAL |
| [`useHead`](https://github.com/vueuse/head#api) | 响应式更新 head 元标签。 | EXTERNAL |

### @Integrations

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useAsyncValidator`](references/useAsyncValidator.md) | [`async-validator`](https://github.com/yiminghe/async-validator) 的包装器 | EXTERNAL |
| [`useAxios`](references/useAxios.md) | [`axios`](https://github.com/axios/axios) 的包装器 | EXTERNAL |
| [`useChangeCase`](references/useChangeCase.md) | [`change-case`](https://github.com/blakeembrey/change-case) 的响应式包装器 | EXTERNAL |
| [`useCookies`](references/useCookies.md) | [`universal-cookie`](https://www.npmjs.com/package/universal-cookie) 的包装器 | EXTERNAL |
| [`useDrauu`](references/useDrauu.md) | [drauu](https://github.com/antfu/drauu) 的响应式实例 | EXTERNAL |
| [`useFocusTrap`](references/useFocusTrap.md) | [`focus-trap`](https://github.com/focus-trap/focus-trap) 的响应式包装器 | EXTERNAL |
| [`useFuse`](references/useFuse.md) | 使用组合式函数通过 [Fuse.js](https://github.com/krisk/fuse) 轻松实现模糊搜索 | EXTERNAL |
| [`useIDBKeyval`](references/useIDBKeyval.md) | [`idb-keyval`](https://www.npmjs.com/package/idb-keyval) 的包装器 | EXTERNAL |
| [`useJwt`](references/useJwt.md) | [`jwt-decode`](https://github.com/auth0/jwt-decode) 的包装器 | EXTERNAL |
| [`useNProgress`](references/useNProgress.md) | [`nprogress`](https://github.com/rstacruz/nprogress) 的响应式包装器 | EXTERNAL |
| [`useQRCode`](references/useQRCode.md) | [`qrcode`](https://github.com/soldair/node-qrcode) 的包装器 | EXTERNAL |
| [`useSortable`](references/useSortable.md) | [`sortable`](https://github.com/SortableJS/Sortable) 的包装器 | EXTERNAL |

### @Math

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`createGenericProjection`](references/createGenericProjection.md) | `createProjection` 的通用版本 | EXTERNAL |
| [`createProjection`](references/createProjection.md) | 从一个域到另一个域的响应式数值投影 | EXTERNAL |
| [`logicAnd`](references/logicAnd.md) | refs 的 `AND` 条件 | EXTERNAL |
| [`logicNot`](references/logicNot.md) | ref 的 `NOT` 条件 | EXTERNAL |
| [`logicOr`](references/logicOr.md) | refs 的 `OR` 条件 | EXTERNAL |
| [`useAbs`](references/useAbs.md) | 响应式 `Math.abs` | EXTERNAL |
| [`useAverage`](references/useAverage.md) | 响应式获取数组平均值 | EXTERNAL |
| [`useCeil`](references/useCeil.md) | 响应式 `Math.ceil` | EXTERNAL |
| [`useClamp`](references/useClamp.md) | 响应式将值限制在另外两个值之间 | EXTERNAL |
| [`useFloor`](references/useFloor.md) | 响应式 `Math.floor` | EXTERNAL |
| [`useMath`](references/useMath.md) | 响应式 `Math` 方法 | EXTERNAL |
| [`useMax`](references/useMax.md) | 响应式 `Math.max` | EXTERNAL |
| [`useMin`](references/useMin.md) | 响应式 `Math.min` | EXTERNAL |
| [`usePrecision`](references/usePrecision.md) | 响应式设置数字精度 | EXTERNAL |
| [`useProjection`](references/useProjection.md) | 从一个域到另一个域的响应式数值投影 | EXTERNAL |
| [`useRound`](references/useRound.md) | 响应式 `Math.round` | EXTERNAL |
| [`useSum`](references/useSum.md) | 响应式获取数组总和 | EXTERNAL |
| [`useTrunc`](references/useTrunc.md) | 响应式 `Math.trunc` | EXTERNAL |

### @Motion

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useElementStyle`](https://motion.vueuse.org/api/use-element-style) | 将响应式对象同步到目标元素 CSS 样式 | EXTERNAL |
| [`useElementTransform`](https://motion.vueuse.org/api/use-element-transform) | 将响应式对象同步到目标元素 CSS 变换。 | EXTERNAL |
| [`useMotion`](https://motion.vueuse.org/api/use-motion) | 让你的组件动起来。 | EXTERNAL |
| [`useMotionProperties`](https://motion.vueuse.org/api/use-motion-properties) | 访问目标元素的运动属性。 | EXTERNAL |
| [`useMotionVariants`](https://motion.vueuse.org/api/use-motion-variants) | 处理变体状态和选择。 | EXTERNAL |
| [`useSpring`](https://motion.vueuse.org/api/use-spring) | 弹簧动画。 | EXTERNAL |

### @Router

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useRouteHash`](references/useRouteHash.md) | 响应式 `route.hash` 的简写 | EXTERNAL |
| [`useRouteParams`](references/useRouteParams.md) | 响应式 `route.params` 的简写 | EXTERNAL |
| [`useRouteQuery`](references/useRouteQuery.md) | 响应式 `route.query` 的简写 | EXTERNAL |

### @RxJS

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`from`](references/from.md) | 包装 RxJS 的 [`from()`](https://rxjs.dev/api/index/function/from) 和 [`fromEvent()`](https://rxjs.dev/api/index/function/fromEvent) 以允许它们接受 `ref` | EXTERNAL |
| [`toObserver`](references/toObserver.md) | 糖函数，将 `ref` 转换为 RxJS [Observer](https://rxjs.dev/guide/observer) | EXTERNAL |
| [`useExtractedObservable`](references/useExtractedObservable.md) | 使用从一个或多个组合式函数中提取的 RxJS [`Observable`](https://rxjs.dev/guide/observable) | EXTERNAL |
| [`useObservable`](references/useObservable.md) | 使用 RxJS [`Observable`](https://rxjs.dev/guide/observable) | EXTERNAL |
| [`useSubject`](references/useSubject.md) | 将 RxJS [`Subject`](https://rxjs.dev/guide/subject) 绑定到 `ref` 并双向传播值更改 | EXTERNAL |
| [`useSubscription`](references/useSubscription.md) | 使用 RxJS [`Subscription`](https://rxjs.dev/guide/subscription) 而无需担心取消订阅或创建内存泄漏 | EXTERNAL |
| [`watchExtractedObservable`](references/watchExtractedObservable.md) | 观察从一个或多个组合式函数中提取的 RxJS [`Observable`](https://rxjs.dev/guide/observable) 的值 | EXTERNAL |

### @SchemaOrg

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`createSchemaOrg`](https://vue-schema-org.netlify.app/api/core/create-schema-org.html) | 创建 schema.org 管理器实例。 | EXTERNAL |
| [`useSchemaOrg`](https://vue-schema-org.netlify.app/api/core/use-schema-org.html) | 响应式更新 schema.org。 | EXTERNAL |

### @Sound

| 函数 | 描述 | 调用方式 |
|----------|-------------|------------|
| [`useSound`](https://github.com/vueuse/sound#examples) | 响应式播放音效。 | EXTERNAL |
