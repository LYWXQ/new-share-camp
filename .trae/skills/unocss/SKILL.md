---
name: unocss
description: UnoCSS 即时原子化 CSS 引擎，Tailwind CSS 的超集。做什么：配置原子化 CSS、编写工具类规则、创建快捷方式、使用预设（Wind、Icons、Attributify 等）。何时调用：需要配置 UnoCSS、编写工具类规则、创建快捷方式或使用各种预设来优化 CSS 开发时。
metadata:
  author: Anthony Fu
  version: "2026.1.28"
  source: Generated from https://github.com/unocss/unocss, scripts located at https://github.com/antfu/skills
---

UnoCSS 是一个即时原子化 CSS 引擎，设计灵活且可扩展。核心本身无预设 - 所有 CSS 工具类都通过预设提供。它是 Tailwind CSS 的超集，因此你可以复用 Tailwind 的基础语法知识。

**重要提示：** 在编写 UnoCSS 代码之前，智能体应检查项目根目录中的 `uno.config.*` 或 `unocss.config.*` 文件，以了解可用的预设、规则和快捷方式。如果项目配置不明确，请避免使用 attributify 模式和其他高级功能 - 坚持使用基础的 `class` 用法。

> 本技能基于 UnoCSS 66.x 版本，生成于 2026-01-28。

## 核心

| 主题 | 描述 | 参考 |
|-------|-------------|-----------|
| 配置 | 配置文件设置和所有配置选项 | [core-config](references/core-config.md) |
| 规则 | 生成 CSS 工具类的静态和动态规则 | [core-rules](references/core-rules.md) |
| 快捷方式 | 将多个规则组合为单个简写 | [core-shortcuts](references/core-shortcuts.md) |
| 主题 | 颜色、断点和设计令牌的主题系统 | [core-theme](references/core-theme.md) |
| 变体 | 将 hover:、dark:、响应式等变体应用于规则 | [core-variants](references/core-variants.md) |
| 提取 | UnoCSS 如何从源代码中提取工具类 | [core-extracting](references/core-extracting.md) |
| 安全列表与黑名单 | 强制包含或排除特定工具类 | [core-safelist](references/core-safelist.md) |
| 层与预检 | CSS 层排序和原始 CSS 注入 | [core-layers](references/core-layers.md) |

## 预设

### 主要预设

| 主题 | 描述 | 参考 |
|-------|-------------|-----------|
| Preset Wind3 | 兼容 Tailwind CSS v3 / Windi CSS 的预设（最常用） | [preset-wind3](references/preset-wind3.md) |
| Preset Wind4 | 兼容 Tailwind CSS v4 的预设，支持现代 CSS 特性 | [preset-wind4](references/preset-wind4.md) |
| Preset Mini | 最小化预设，包含构建自定义版本所需的基本工具类 | [preset-mini](references/preset-mini.md) |

### 功能预设

| 主题 | 描述 | 参考 |
|-------|-------------|-----------|
| Preset Icons | 使用 Iconify 的纯 CSS 图标，支持任意图标集 | [preset-icons](references/preset-icons.md) |
| Preset Attributify | 在 HTML 属性中分组工具类，替代 class | [preset-attributify](references/preset-attributify.md) |
| Preset Typography | 排版默认值的 Prose 类 | [preset-typography](references/preset-typography.md) |
| Preset Web Fonts | 轻松集成 Google Fonts 和其他网络字体 | [preset-web-fonts](references/preset-web-fonts.md) |
| Preset Tagify | 将工具类用作 HTML 标签名 | [preset-tagify](references/preset-tagify.md) |
| Preset Rem to Px | 将 rem 单位转换为 px | [preset-rem-to-px](references/preset-rem-to-px.md) |

## 转换器

| 主题 | 描述 | 参考 |
|-------|-------------|-----------|
| Variant Group | 使用公共前缀分组工具类的简写 | [transformer-variant-group](references/transformer-variant-group.md) |
| Directives | CSS 指令：@apply、@screen、theme()、icon() | [transformer-directives](references/transformer-directives.md) |
| Compile Class | 将多个类编译为一个哈希类 | [transformer-compile-class](references/transformer-compile-class.md) |
| Attributify JSX | 在 JSX/TSX 中支持无值 attributify | [transformer-attributify-jsx](references/transformer-attributify-jsx.md) |

## 集成

| 主题 | 描述 | 参考 |
|-------|-------------|-----------|
| Vite 集成 | 使用 Vite 设置 UnoCSS 和框架特定技巧 | [integrations-vite](references/integrations-vite.md) |
| Nuxt 集成 | Nuxt 应用的 UnoCSS 模块 | [integrations-nuxt](references/integrations-nuxt.md) |
