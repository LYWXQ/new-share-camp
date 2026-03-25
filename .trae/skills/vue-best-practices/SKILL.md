---
name: vue-best-practices
description: Vue.js 最佳实践指南，涵盖 Vue 3、SSR、Volar、vue-tsc。做什么：提供 Vue 开发的最佳实践、常见陷阱和性能优化建议，推荐使用 Composition API 配合 `<script setup>` 和 TypeScript。何时调用：处理任何 Vue、.vue 文件、Vue Router、Pinia 或 Vite 与 Vue 相关的工作时需要遵循最佳实践或解决常见问题时。
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: "17.0.0"
---

Vue 3 最佳实践、常见陷阱和性能优化指南。

### 响应式系统
- 在脚本中访问 ref() 值时忘记使用 .value → 参见 [ref-value-access](reference/ref-value-access.md)
- 解构 reactive() 对象导致失去响应式 → 参见 [reactive-destructuring](reference/reactive-destructuring.md)
- 在 ref() 和 reactive() 之间选择状态管理方式 → 参见 [prefer-ref-over-reactive](reference/prefer-ref-over-reactive.md)
- 在数组和集合中访问 refs → 参见 [refs-in-collections-need-value](reference/refs-in-collections-need-value.md)
- 大型对象或外部库数据带来的性能开销 → 参见 [shallow-ref-for-performance](reference/shallow-ref-for-performance.md)
- 在模板表达式中使用嵌套 refs → 参见 [template-ref-unwrapping-top-level](reference/template-ref-unwrapping-top-level.md)
- 使用 === 运算符比较响应式对象 → 参见 [reactivity-proxy-identity-hazard](reference/reactivity-proxy-identity-hazard.md)
- 库实例在响应式状态中出现问题 → 参见 [reactivity-markraw-for-non-reactive](reference/reactivity-markraw-for-non-reactive.md)
- 期望监听器在每次状态变化时都触发 → 参见 [reactivity-same-tick-batching](reference/reactivity-same-tick-batching.md)
- 集成外部状态管理库 → 参见 [reactivity-external-state-integration](reference/reactivity-external-state-integration.md)
- 追踪意外的重新渲染和状态更新 → 参见 [reactivity-debugging-hooks](reference/reactivity-debugging-hooks.md)
- 使用 watchEffect 而非 computed 派生状态 → 参见 [reactivity-computed-over-watcheffect-mutations](reference/reactivity-computed-over-watcheffect-mutations.md)

### 计算属性
- 计算属性的 getter 中进行 API 调用或状态修改 → 参见 [computed-no-side-effects](reference/computed-no-side-effects.md)
- 修改计算属性值导致意外丢失更改 → 参见 [computed-return-value-readonly](reference/computed-return-value-readonly.md)
- 计算属性在预期时未更新 → 参见 [computed-conditional-dependencies](reference/computed-conditional-dependencies.md)
- 排序或反转数组破坏原始数据 → 参见 [computed-array-mutation](reference/computed-array-mutation.md)
- 昂贵操作在每次渲染时频繁运行 → 参见 [computed-vs-methods-caching](reference/computed-vs-methods-caching.md)
- 尝试向计算属性传递参数 → 参见 [computed-no-parameters](reference/computed-no-parameters.md)
- 复杂条件使内联类绑定膨胀 → 参见 [computed-properties-for-class-logic](reference/computed-properties-for-class-logic.md)

### 监听器
- 需要监听响应式对象的属性 → 参见 [watch-reactive-property-getter](reference/watch-reactive-property-getter.md)
- 大型嵌套数据结构导致性能问题 → 参见 [watch-deep-performance](reference/watch-deep-performance.md)
- 异步操作被陈旧数据覆盖 → 参见 [watch-async-cleanup](reference/watch-async-cleanup.md)
- 在异步回调中创建监听器 → 参见 [watch-async-creation-memory-leak](reference/watch-async-creation-memory-leak.md)
- await 之后访问的依赖项未被追踪 → 参见 [watcheffect-async-dependency-tracking](reference/watcheffect-async-dependency-tracking.md)
- 需要在监听器中访问更新后的 DOM → 参见 [watch-flush-timing](reference/watch-flush-timing.md)
- 不确定使用 watch 还是 watchEffect → 参见 [watch-vs-watcheffect](reference/watch-vs-watcheffect.md)
- 初始调用和监听回调重复执行 → 参见 [watch-immediate-option](reference/watch-immediate-option.md)
- 无法正确比较新旧值 → 参见 [watch-deep-same-object-reference](reference/watch-deep-same-object-reference.md)
- 模板引用显示为 null 或陈旧值 → 参见 [watcheffect-flush-post-for-refs](reference/watcheffect-flush-post-for-refs.md)

### 组件
- 从子组件修改 prop 值 → 参见 [props-are-read-only](reference/props-are-read-only.md)
- 父组件无法在 script setup 中访问子组件 ref 数据 → 参见 [component-ref-requires-defineexpose](reference/component-ref-requires-defineexpose.md)
- 子组件抛出"找不到组件"错误 → 参见 [local-components-not-in-descendants](reference/local-components-not-in-descendants.md)
- 自定义组件上的点击监听器不触发 → 参见 [click-events-on-components](reference/click-events-on-components.md)
- HTML 模板解析破坏 Vue 组件语法 → 参见 [in-dom-template-parsing-caveats](reference/in-dom-template-parsing-caveats.md)
- 祖父组件无法监听孙组件发出的事件 → 参见 [component-events-dont-bubble](reference/component-events-dont-bubble.md)
- 命名冲突导致渲染错误组件 → 参见 [component-naming-conflicts](reference/component-naming-conflicts.md)
- 区分 Vue 组件和原生元素 → 参见 [component-naming-pascalcase](reference/component-naming-pascalcase.md)
- 父组件样式不应用于多根组件 → 参见 [multi-root-component-class-attrs](reference/multi-root-component-class-attrs.md)
- 递归组件需要引用自身 → 参见 [self-referencing-component-name](reference/self-referencing-component-name.md)
- 打包包含未使用的组件 → 参见 [prefer-local-component-registration](reference/prefer-local-component-registration.md)
- 通过组件 ref 访问导致紧耦合 → 参见 [prefer-props-emit-over-component-refs](reference/prefer-props-emit-over-component-refs.md)

### Props & Emits
- 布尔类型 prop 未按预期解析 → 参见 [prop-boolean-casting-order](reference/prop-boolean-casting-order.md)
- 可组合函数在 props 变化时不更新 → 参见 [prop-composable-reactivity-loss](reference/prop-composable-reactivity-loss.md)
- defineProps 中引用的变量导致错误 → 参见 [prop-defineprops-scope-limitation](reference/prop-defineprops-scope-limitation.md)
- 解构的 props 不更新监听器 → 参见 [prop-destructured-watch-getter](reference/prop-destructured-watch-getter.md)
- prop 验证需要组件实例数据 → 参见 [prop-validation-before-instance](reference/prop-validation-before-instance.md)
- 组件发出未声明的事件导致警告 → 参见 [declare-emits-for-documentation](reference/declare-emits-for-documentation.md)
- defineEmits 在函数或条件语句中使用 → 参见 [defineEmits-must-be-top-level](reference/defineEmits-must-be-top-level.md)
- defineEmits 同时具有类型和运行时参数 → 参见 [defineEmits-no-runtime-and-type-mixed](reference/defineEmits-no-runtime-and-type-mixed.md)
- 模板和脚本中的事件名称不一致 → 参见 [emit-kebab-case-in-templates](reference/emit-kebab-case-in-templates.md)
- 事件负载需要在开发期间进行验证 → 参见 [emit-validation-for-complex-payloads](reference/emit-validation-for-complex-payloads.md)
- 原生事件监听器对点击无响应 → 参见 [native-event-collision-with-emits](reference/native-event-collision-with-emits.md)
- 点击时组件事件触发两次 → 参见 [undeclared-emits-double-firing](reference/undeclared-emits-double-firing.md)

### 模板
- 将不受信任的用户内容渲染为 HTML → 参见 [v-html-xss-security](reference/v-html-xss-security.md)
- 过滤或条件隐藏列表项 → 参见 [no-v-if-with-v-for](reference/no-v-if-with-v-for.md)
- 列表项意外消失或交换状态 → 参见 [v-for-key-attribute](reference/v-for-key-attribute.md)
- 使用语句时出现模板编译错误 → 参见 [template-expressions-restrictions](reference/template-expressions-restrictions.md)
- 动态指令参数无法正常工作 → 参见 [dynamic-argument-constraints](reference/dynamic-argument-constraints.md)
- 模板中的函数意外修改数据 → 参见 [template-functions-no-side-effects](reference/template-functions-no-side-effects.md)
- v-else 元素无条件渲染 → 参见 [v-else-must-follow-v-if](reference/v-else-must-follow-v-if.md)
- 循环中的子组件显示未定义数据 → 参见 [v-for-component-props](reference/v-for-component-props.md)
- 排序或反转后数组顺序改变 → 参见 [v-for-computed-reverse-sort](reference/v-for-computed-reverse-sort.md)
- 范围迭代出现差一错误 → 参见 [v-for-range-starts-at-one](reference/v-for-range-starts-at-one.md)
- 过滤或排序列表的性能问题 → 参见 [v-for-use-computed-for-filtering](reference/v-for-use-computed-for-filtering.md)
- 出现"Cannot read property of undefined"运行时错误 → 参见 [v-if-null-check-order](reference/v-if-null-check-order.md)
- 在 v-if 和 v-show 之间选择条件渲染 → 参见 [v-if-vs-v-show-performance](reference/v-if-vs-v-show-performance.md)
- v-show 或 v-else 在 template 元素上不起作用 → 参见 [v-show-template-limitation](reference/v-show-template-limitation.md)

### 模板引用
- 元素被条件隐藏时引用变为 null → 参见 [template-ref-null-with-v-if](reference/template-ref-null-with-v-if.md)
- 循环中引用数组索引与数据数组不匹配 → 参见 [template-ref-v-for-order](reference/template-ref-v-for-order.md)
- 重构模板引用名称导致代码静默中断 → 参见 [use-template-ref-vue35](reference/use-template-ref-vue35.md)

### 表单 & v-model
- 使用 v-model 时初始表单值不显示 → 参见 [v-model-ignores-html-attributes](reference/v-model-ignores-html-attributes.md)
- textarea 内容更改未更新 ref → 参见 [textarea-no-interpolation](reference/textarea-no-interpolation.md)
- iOS 用户无法选择下拉框第一个选项 → 参见 [select-initial-value-ios-bug](reference/select-initial-value-ios-bug.md)
- 父组件和子组件具有不同的值 → 参见 [define-model-default-value-sync](reference/define-model-default-value-sync.md)
- 需要在子组件中处理 v-model 修饰符 → 参见 [definemodel-hidden-modifier-props](reference/definemodel-hidden-modifier-props.md)
- 对象属性更改未同步到父组件 → 参见 [definemodel-object-mutation-no-emit](reference/definemodel-object-mutation-no-emit.md)
- 更改后需要立即使用更新后的值 → 参见 [definemodel-value-next-tick](reference/definemodel-value-next-tick.md)
- 中文/日文输入的实时搜索/验证失效 → 参见 [v-model-ime-composition](reference/v-model-ime-composition.md)
- 数字输入返回空字符串而非零 → 参见 [v-model-number-modifier-behavior](reference/v-model-number-modifier-behavior.md)
- 将 Vue 2 组件迁移到 Vue 3 → 参见 [v-model-vue3-breaking-changes](reference/v-model-vue3-breaking-changes.md)
- 表单提交时自定义复选框值未提交 → 参见 [checkbox-true-false-value-form-submission](reference/checkbox-true-false-value-form-submission.md)

### 事件 & 修饰符
- 链式多个事件修饰符产生意外结果 → 参见 [event-modifier-order-matters](reference/event-modifier-order-matters.md)
- 需要只处理一次相同事件 → 参见 [event-once-modifier-for-single-use](reference/event-once-modifier-for-single-use.md)
- 键盘快捷键在意外的修饰符组合下触发 → 参见 [exact-modifier-for-precise-shortcuts](reference/exact-modifier-for-precise-shortcuts.md)
- 键盘快捷键在系统修饰键下不触发 → 参见 [keyup-modifier-timing](reference/keyup-modifier-timing.md)
- 使用左手鼠标或非标准输入设备 → 参见 [mouse-button-modifiers-intent](reference/mouse-button-modifiers-intent.md)
- 同时阻止默认浏览器行为和滚动性能 → 参见 [no-passive-with-prevent](reference/no-passive-with-prevent.md)

### 生命周期
- 生命周期钩子无法异步执行 → 参见 [lifecycle-hooks-synchronous-registration](reference/lifecycle-hooks-synchronous-registration.md)
- 组件挂载前 DOM 访问失败 → 参见 [lifecycle-dom-access-timing](reference/lifecycle-dom-access-timing.md)
- 未移除的事件监听器导致内存泄漏 → 参见 [cleanup-side-effects](reference/cleanup-side-effects.md)
- SSR 渲染与客户端水合不同 → 参见 [lifecycle-ssr-awareness](reference/lifecycle-ssr-awareness.md)
- 昂贵操作严重影响性能 → 参见 [updated-hook-performance](reference/updated-hook-performance.md)
- 状态更改后 DOM 读取返回陈旧值 → 参见 [dom-update-timing-nexttick](reference/dom-update-timing-nexttick.md)

### 插槽
- 在插槽内容中访问子组件数据 → 参见 [slot-render-scope-parent-only](reference/slot-render-scope-parent-only.md)
- 混合使用具名插槽和作用域插槽 → 参见 [slot-named-scoped-explicit-default](reference/slot-named-scoped-explicit-default.md)
- 在原生 HTML 元素上使用 v-slot → 参见 [slot-v-slot-on-components-or-templates-only](reference/slot-v-slot-on-components-or-templates-only.md)
- 空包装元素不必要地渲染 → 参见 [slot-conditional-rendering-with-slots](reference/slot-conditional-rendering-with-slots.md)
- 作用域插槽 props 缺乏 TypeScript 类型安全 → 参见 [slot-define-slots-for-typescript](reference/slot-define-slots-for-typescript.md)
- 渲染没有默认值的空组件插槽 → 参见 [slot-fallback-content-default-values](reference/slot-fallback-content-default-values.md)
- 包装组件破坏子插槽功能 → 参见 [slot-forwarding-to-child-components](reference/slot-forwarding-to-child-components.md)
- 不清楚哪个插槽内容放在哪里 → 参见 [slot-implicit-default-content](reference/slot-implicit-default-content.md)
- 期望在作用域插槽 props 中有 name 属性 → 参见 [slot-name-reserved-prop](reference/slot-name-reserved-prop.md)
- 在无渲染组件和可组合函数之间选择 → 参见 [slot-renderless-components-vs-composables](reference/slot-renderless-components-vs-composables.md)

### Provide/Inject
- 提供者更改时注入的值不更新 → 参见 [provide-inject-reactivity-not-automatic](reference/provide-inject-reactivity-not-automatic.md)
- 异步操作后调用 provide 静默失败 → 参见 [provide-inject-synchronous-setup](reference/provide-inject-synchronous-setup.md)
- 字符串键在大型应用中冲突 → 参见 [provide-inject-symbol-keys](reference/provide-inject-symbol-keys.md)
- 追踪提供的值来自何处 → 参见 [provide-inject-debugging-challenges](reference/provide-inject-debugging-challenges.md)
- 多个组件共享相同的默认对象 → 参见 [provide-inject-default-value-factory](reference/provide-inject-default-value-factory.md)
- 状态变更分散在多个组件中 → 参见 [provide-inject-mutations-in-provider](reference/provide-inject-mutations-in-provider.md)
- 通过多个组件层传递 props → 参见 [avoid-prop-drilling-use-provide-inject](reference/avoid-prop-drilling-use-provide-inject.md)

### Attrs
- 内部和透传事件处理程序都执行 → 参见 [attrs-event-listener-merging](reference/attrs-event-listener-merging.md)
- 在 JavaScript 代码中访问连字符属性 → 参见 [attrs-hyphenated-property-access](reference/attrs-hyphenated-property-access.md)
- 使用 watch() 监听透传属性的变化 → 参见 [attrs-not-reactive](reference/attrs-not-reactive.md)
- 显式属性被透传值覆盖 → 参见 [fallthrough-attrs-overwrite-vue3](reference/fallthrough-attrs-overwrite-vue3.md)
- 属性应用于包装器中的错误元素 → 参见 [inheritattrs-false-for-wrapper-components](reference/inheritattrs-false-for-wrapper-components.md)

### 可组合函数
- 可组合函数有意外副作用影响外部状态 → 参见 [composable-avoid-hidden-side-effects](reference/composable-avoid-hidden-side-effects.md)
- 在 setup 上下文外部或异步调用可组合函数 → 参见 [composable-call-location-restrictions](reference/composable-call-location-restrictions.md)
- 从较小的专注可组合函数构建复杂逻辑 → 参见 [composable-composition-pattern](reference/composable-composition-pattern.md)
- 可组合函数名称不一致或解构失去响应式 → 参见 [composable-naming-return-pattern](reference/composable-naming-return-pattern.md)
- 可组合函数有多个可选参数或参数顺序混乱 → 参见 [composable-options-object-pattern](reference/composable-options-object-pattern.md)
- 需要防止对可组合函数状态的非受控修改 → 参见 [composable-readonly-state](reference/composable-readonly-state.md)
- 可组合函数响应式依赖在输入变化时不更新 → 参见 [composable-tovalue-inside-watcheffect](reference/composable-tovalue-inside-watcheffect.md)
- 不确定逻辑属于可组合函数还是工具函数 → 参见 [composable-vs-utility-functions](reference/composable-vs-utility-functions.md)

### Composition API
- 优化生产包大小和性能 → 参见 [composition-api-bundle-size-minification](reference/composition-api-bundle-size-minification.md)
- Composition API 代码变得分散且难以维护 → 参见 [composition-api-code-organization](reference/composition-api-code-organization.md)
- 修复 mixins 中的命名冲突和数据来源不清 → 参见 [composition-api-mixins-replacement](reference/composition-api-mixins-replacement.md)
- 将函数式模式错误地应用于 Vue 状态 → 参见 [composition-api-not-functional-programming](reference/composition-api-not-functional-programming.md)
- 逐步迁移大型 Options API 代码库 → 参见 [composition-api-options-api-coexistence](reference/composition-api-options-api-coexistence.md)
- 异步操作后生命周期钩子静默失败 → 参见 [composition-api-script-setup-async-context](reference/composition-api-script-setup-async-context.md)
- 从 React 过来，过度设计 Vue 模式 → 参见 [composition-api-vs-react-hooks-differences](reference/composition-api-vs-react-hooks-differences.md)
- 父组件 refs 无法访问暴露的属性 → 参见 [define-expose-before-await](reference/define-expose-before-await.md)

### 指令
- 在指令钩子之间存储状态 → 参见 [directive-arguments-read-only](reference/directive-arguments-read-only.md)
- 将自定义指令应用于 Vue 组件 → 参见 [directive-avoid-on-components](reference/directive-avoid-on-components.md)
- 在指令中创建定时器或事件监听器 → 参见 [directive-cleanup-in-unmounted](reference/directive-cleanup-in-unmounted.md)
- 使用函数简写简化指令 → 参见 [directive-function-shorthand](reference/directive-function-shorthand.md)
- 在 script setup 中使用自定义指令 → 参见 [directive-naming-v-prefix](reference/directive-naming-v-prefix.md)
- 在自定义指令和内置指令之间选择 → 参见 [directive-prefer-declarative-templating](reference/directive-prefer-declarative-templating.md)
- 在指令和组件之间做决策 → 参见 [directive-vs-component-decision](reference/directive-vs-component-decision.md)
- 将 Vue 2 指令迁移到 Vue 3 → 参见 [directive-vue2-migration-hooks](reference/directive-vue2-migration-hooks.md)

### 过渡动画
- 在过渡中包装多个元素或组件 → 参见 [transition-single-element-slot](reference/transition-single-element-slot.md)
- 相同元素类型之间过渡没有动画 → 参见 [transition-key-for-same-element](reference/transition-key-for-same-element.md)
- 使用 JavaScript 动画时未调用 done 回调 → 参见 [transition-js-hooks-done-callback](reference/transition-js-hooks-done-callback.md)
- 在 TransitionGroup 中动画列表没有唯一键 → 参见 [transition-group-key-requirement](reference/transition-group-key-requirement.md)
- 列表动画出现卡顿的性能问题 → 参见 [transition-animate-transform-opacity](reference/transition-animate-transform-opacity.md)
- 行内列表元素的移动动画失败 → 参见 [transition-group-flip-inline-elements](reference/transition-group-flip-inline-elements.md)
- 列表项跳跃而非平滑动画 → 参见 [transition-group-move-animation-position-absolute](reference/transition-group-move-animation-position-absolute.md)
- Vue 2 到 Vue 3 过渡布局意外中断 → 参见 [transition-group-no-default-wrapper-vue3](reference/transition-group-no-default-wrapper-vue3.md)
- 尝试使用 mode prop 对列表动画排序 → 参见 [transition-group-no-mode-prop](reference/transition-group-no-mode-prop.md)
- 创建列表项动画的级联延迟 → 参见 [transition-group-staggered-animations](reference/transition-group-staggered-animations.md)
- 过渡期间元素重叠或布局跳跃 → 参见 [transition-mode-out-in](reference/transition-mode-out-in.md)
- 嵌套过渡动画过早切断 → 参见 [transition-nested-duration](reference/transition-nested-duration.md)
- 可复用过渡组件与作用域样式破坏 → 参见 [transition-reusable-scoped-style](reference/transition-reusable-scoped-style.md)
- RouterView 过渡在页面加载时意外动画 → 参见 [transition-router-view-appear](reference/transition-router-view-appear.md)
- 混合 CSS 过渡和动画导致时序问题 → 参见 [transition-type-when-mixed](reference/transition-type-when-mixed.md)
- 快速过渡替换期间组件清理未触发 → 参见 [transition-unmount-hook-timing](reference/transition-unmount-hook-timing.md)

### 动画
- 需要对 DOM 中保留的元素进行动画 → 参见 [animation-class-based-technique](reference/animation-class-based-technique.md)
- 内容变化时动画未触发 → 参见 [animation-key-for-rerender](reference/animation-key-for-rerender.md)
- 使用用户输入构建交互式动画 → 参见 [animation-state-driven-technique](reference/animation-state-driven-technique.md)
- 动画列表更改导致明显延迟 → 参见 [animation-transitiongroup-performance](reference/animation-transitiongroup-performance.md)

### KeepAlive
- 使用 KeepAlive 没有适当的缓存限制或清理 → 参见 [keepalive-memory-management](reference/keepalive-memory-management.md)
- KeepAlive include/exclude props 与缓存组件不匹配 → 参见 [keepalive-component-name-requirement](reference/keepalive-component-name-requirement.md)
- 需要从 KeepAlive 缓存中程序化移除组件 → 参见 [keepalive-no-cache-removal-vue3](reference/keepalive-no-cache-removal-vue3.md)
- 用户看到陈旧缓存内容而非新鲜页面数据 → 参见 [keepalive-router-fresh-vs-cached](reference/keepalive-router-fresh-vs-cached.md)
- 嵌套 Vue Router 路由时子组件挂载两次 → 参见 [keepalive-router-nested-double-mount](reference/keepalive-router-nested-double-mount.md)
- 结合 KeepAlive 与 Transition 动画时内存增长 → 参见 [keepalive-transition-memory-leak](reference/keepalive-transition-memory-leak.md)
- 在动态组件之间切换时状态重置 → 参见 [dynamic-components-with-keepalive](reference/dynamic-components-with-keepalive.md)

### 异步组件
- 设置 Vue Router 路由组件加载 → 参见 [async-component-vue-router](reference/async-component-vue-router.md)
- 异步组件选项被父级 Suspense 忽略 → 参见 [async-component-suspense-control](reference/async-component-suspense-control.md)
- 网络故障或超时加载组件 → 参见 [async-component-error-handling](reference/async-component-error-handling.md)
- 使用 SSR 应用改善可交互时间 → 参见 [async-component-hydration-strategies](reference/async-component-hydration-strategies.md)
- 组件重新激活后模板引用未定义 → 参见 [async-component-keepalive-ref-issue](reference/async-component-keepalive-ref-issue.md)
- 快速网络上加载闪烁 → 参见 [async-component-loading-delay](reference/async-component-loading-delay.md)

### 渲染函数
- setup 中的渲染函数没有响应式更新 → 参见 [rendering-render-function-return-from-setup](reference/rendering-render-function-return-from-setup.md)
- 相同的 vnode 在树中出现多次 → 参见 [render-function-vnodes-must-be-unique](reference/render-function-vnodes-must-be-unique.md)
- 在渲染函数中渲染列表没有键 → 参见 [render-function-v-for-keys-required](reference/render-function-v-for-keys-required.md)
- 在渲染函数中实现 .stop、.prevent → 参见 [render-function-event-modifiers](reference/render-function-event-modifiers.md)
- 在渲染函数中对组件进行双向绑定 → 参见 [render-function-v-model-implementation](reference/render-function-v-model-implementation.md)
- 在渲染函数中使用字符串名称作为组件 → 参见 [rendering-resolve-component-for-string-names](reference/rendering-resolve-component-for-string-names.md)
- 访问 vnode 内部属性如 el 或 shapeFlag → 参见 [render-function-avoid-internal-vnode-properties](reference/render-function-avoid-internal-vnode-properties.md)
- 创建简单的无状态展示组件 → 参见 [render-function-functional-components](reference/render-function-functional-components.md)
- 在渲染函数中应用自定义指令 → 参见 [render-function-custom-directives](reference/render-function-custom-directives.md)
- 监听器或深度监听器导致过度重新渲染 → 参见 [rendering-excessive-rerenders-watch-vs-computed](reference/rendering-excessive-rerenders-watch-vs-computed.md)
- 选择渲染函数而非模板 → 参见 [rendering-prefer-templates-over-render-functions](reference/rendering-prefer-templates-over-render-functions.md)
- 将 Vue 2 渲染函数迁移到 Vue 3 → 参见 [rendering-render-function-h-import-vue3](reference/rendering-render-function-h-import-vue3.md)
- 错误地向 h() 传递插槽内容 → 参见 [rendering-render-function-slots-as-functions](reference/rendering-render-function-slots-as-functions.md)
- 理解 Vue 的虚拟 DOM 优化块 → 参见 [rendering-understand-vdom-block-structure](reference/rendering-understand-vdom-block-structure.md)

### Teleport
- Teleport 目标元素在 DOM 中未找到 → 参见 [teleport-target-must-exist](reference/teleport-target-must-exist.md)
- 传送内容破坏 SSR 水合 → 参见 [teleport-ssr-hydration](reference/teleport-ssr-hydration.md)
- 模态框随父级 CSS 变换破坏 → 参见 [teleport-css-positioning-issues](reference/teleport-css-positioning-issues.md)
- 内容在移动端需要不同布局 → 参见 [teleport-disabled-for-responsive](reference/teleport-disabled-for-responsive.md)
- 不确定 props/events 是否通过 teleport 工作 → 参见 [teleport-logical-hierarchy-preserved](reference/teleport-logical-hierarchy-preserved.md)
- 多个模态框定位到同一容器 → 参见 [teleport-multiple-to-same-target](reference/teleport-multiple-to-same-target.md)
- 作用域样式不应用于传送内容 → 参见 [teleport-scoped-styles-limitation](reference/teleport-scoped-styles-limitation.md)

### Suspense
- 需要处理来自 Suspense 组件的异步错误 → 参见 [suspense-no-builtin-error-handling](reference/suspense-no-builtin-error-handling.md)
- 想要以编程方式追踪 Suspense 加载状态 → 参见 [suspense-events-for-state-tracking](reference/suspense-events-for-state-tracking.md)
- 在生产应用中规划 Suspense 使用 → 参见 [suspense-experimental-api-stability](reference/suspense-experimental-api-stability.md)
- 内容更改时回退未显示 → 参见 [suspense-fallback-not-immediate-on-revert](reference/suspense-fallback-not-immediate-on-revert.md)
- 嵌套 Suspense 组件 → 参见 [suspense-nested-suspensible-prop](reference/suspense-nested-suspensible-prop.md)
- 将 Suspense 与 Router、Transition、KeepAlive 结合 → 参见 [suspense-nesting-order-with-router](reference/suspense-nesting-order-with-router.md)
- 嵌套异步组件未显示加载指示器 → 参见 [suspense-revert-only-on-root-change](reference/suspense-revert-only-on-root-change.md)
- 单个 Suspense 中有多个异步组件 → 参见 [suspense-single-child-requirement](reference/suspense-single-child-requirement.md)
- 将 Suspense 与服务器端渲染一起使用 → 参见 [suspense-ssr-hydration-issues](reference/suspense-ssr-hydration-issues.md)

### TypeScript
- 在 Composition API 组件中使用 TypeScript 声明 props → 参见 [ts-defineprops-type-based-declaration](reference/ts-defineprops-type-based-declaration.md)
- 为可变 prop 类型提供默认值 → 参见 [ts-withdefaults-mutable-factory-function](reference/ts-withdefaults-mutable-factory-function.md)
- 使用 ref 解包问题键入响应式状态 → 参见 [ts-reactive-no-generic-argument](reference/ts-reactive-no-generic-argument.md)
- 组件挂载后访问 DOM 元素 → 参见 [ts-template-ref-null-handling](reference/ts-template-ref-null-handling.md)
- 键入对子 Vue 组件的 refs → 参见 [ts-component-ref-typeof-instancetype](reference/ts-component-ref-typeof-instancetype.md)
- 使用支持 TypeScript 的自定义指令 → 参见 [ts-custom-directive-type-augmentation](reference/ts-custom-directive-type-augmentation.md)
- 使用完整类型安全声明组件事件 → 参见 [ts-defineemits-type-based-syntax](reference/ts-defineemits-type-based-syntax.md)
- 在 TypeScript 中处理可选布尔 props → 参见 [ts-defineprops-boolean-default-false](reference/ts-defineprops-boolean-default-false.md)
- 在 defineProps 中安全使用导入类型 → 参见 [ts-defineprops-imported-types-limitations](reference/ts-defineprops-imported-types-limitations.md)
- 使用严格 TypeScript 检查处理 DOM 事件 → 参见 [ts-event-handler-explicit-typing](reference/ts-event-handler-explicit-typing.md)
- 在组件之间安全共享数据 → 参见 [ts-provide-inject-injection-key](reference/ts-provide-inject-injection-key.md)
- 在响应式状态中存储 Vue 组件 → 参见 [ts-shallowref-for-dynamic-components](reference/ts-shallowref-for-dynamic-components.md)
- 在 Vue 模板中使用联合类型 → 参见 [ts-template-type-casting](reference/ts-template-type-casting.md)

### SSR
- 用户数据在服务器请求之间泄漏 → 参见 [state-ssr-cross-request-pollution](reference/state-ssr-cross-request-pollution.md)
- HTML 在服务器和客户端渲染之间不同 → 参见 [ssr-hydration-mismatch-causes](reference/ssr-hydration-mismatch-causes.md)
- 代码在服务器和浏览器环境都运行 → 参见 [ssr-platform-specific-apis](reference/ssr-platform-specific-apis.md)
- 自定义指令在服务器渲染 HTML 上不显示 → 参见 [ssr-custom-directive-getssrprops](reference/ssr-custom-directive-getssrprops.md)

### 性能
- 状态变化时许多列表项不必要地重新渲染 → 参见 [perf-props-stability-update-optimization](reference/perf-props-stability-update-optimization.md)
- 渲染数百或数千项导致 DOM 性能问题 → 参见 [perf-virtualize-large-lists](reference/perf-virtualize-large-lists.md)
- 静态内容在每次父组件更新时重新求值 → 参见 [perf-v-once-v-memo-directives](reference/perf-v-once-v-memo-directives.md)
- 深度嵌套组件结构导致列表性能下降 → 参见 [perf-avoid-component-abstraction-in-lists](reference/perf-avoid-component-abstraction-in-lists.md)
- 返回对象的计算属性意外触发 effect → 参见 [perf-computed-object-stability](reference/perf-computed-object-stability.md)
- 页面加载指标受客户端 JavaScript 执行延迟影响 → 参见 [perf-ssr-ssg-for-page-load](reference/perf-ssr-ssg-for-page-load.md)

### SFC (单文件组件)
- 尝试从组件脚本块使用命名导出 → 参见 [sfc-named-exports-forbidden](reference/sfc-named-exports-forbidden.md)
- 使用构建设置启动 Vue 项目 → 参见 [sfc-recommended-for-build-projects](reference/sfc-recommended-for-build-projects.md)
- 使用作用域 CSS 样式化子组件元素 → 参见 [sfc-scoped-css-child-component-styling](reference/sfc-scoped-css-child-component-styling.md)
- 样式化使用 v-html 动态添加的内容 → 参见 [sfc-scoped-css-dynamic-content](reference/sfc-scoped-css-dynamic-content.md)
- 优化作用域 CSS 选择器性能 → 参见 [sfc-scoped-css-performance](reference/sfc-scoped-css-performance.md)
- 样式化通过组件插槽传递的内容 → 参见 [sfc-scoped-css-slot-content](reference/sfc-scoped-css-slot-content.md)
- 更改后变量未在模板中更新 → 参见 [sfc-script-setup-reactivity](reference/sfc-script-setup-reactivity.md)
- 组织组件模板、逻辑和样式 → 参见 [sfc-separation-of-concerns-colocate](reference/sfc-separation-of-concerns-colocate.md)
- 使用属性名绑定内联样式 → 参见 [style-binding-camelcase](reference/style-binding-camelcase.md)
- 使用字符串拼接构建 Tailwind 类 → 参见 [tailwind-dynamic-class-generation](reference/tailwind-dynamic-class-generation.md)

### 插件
- 调试全局属性导致命名冲突 → 参见 [plugin-global-properties-sparingly](reference/plugin-global-properties-sparingly.md)
- 插件不工作或 inject 返回 undefined → 参见 [plugin-install-before-mount](reference/plugin-install-before-mount.md)
- 全局属性在 setup 函数中不可用 → 参见 [plugin-prefer-provide-inject-over-global-properties](reference/plugin-prefer-provide-inject-over-global-properties.md)
- 从头创建 Vue 插件 → 参见 [plugin-structure-install-method](reference/plugin-structure-install-method.md)
- 防止多个插件之间的冲突 → 参见 [plugin-symbol-injection-keys](reference/plugin-symbol-injection-keys.md)
- 全局属性缺少 TypeScript 自动完成支持 → 参见 [plugin-typescript-type-augmentation](reference/plugin-typescript-type-augmentation.md)

### 应用配置
- 应用配置方法在 mount 调用后不起作用 → 参见 [configure-app-before-mount](reference/configure-app-before-mount.md)
- 需要在 mount 后链式调用应用配置方法 → 参见 [mount-return-value](reference/mount-return-value.md)
- Vue 仅控制特定页面部分 → 参见 [multiple-app-instances](reference/multiple-app-instances.md)
- 将动态组件注册迁移到 Vite → 参见 [dynamic-component-registration-vite](reference/dynamic-component-registration-vite.md)
