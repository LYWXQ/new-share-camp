---
name: core-cli
description: Vite CLI 命令用于开发、构建和预览
---

# Vite CLI

## 开发服务器

启动开发服务器：

```bash
vite [root]
vite dev [root]   # 别名
vite serve [root] # 别名
```

### 开发服务器选项

| 选项 | 描述 |
|------|------|
| `--host [host]` | 指定主机名（使用 `0.0.0.0` 进行局域网访问） |
| `--port <port>` | 指定端口（默认：5173） |
| `--open [path]` | 启动时打开浏览器 |
| `--cors` | 启用 CORS |
| `--strictPort` | 端口被占用时退出 |
| `--force` | 强制优化器重新打包依赖 |
| `-c, --config <file>` | 使用指定的配置文件 |
| `--base <path>` | 公共基础路径 |
| `-m, --mode <mode>` | 设置环境模式 |
| `-l, --logLevel <level>` | info \| warn \| error \| silent |
| `--clearScreen` | 允许/禁止日志记录时清屏 |

## 构建

构建生产环境：

```bash
vite build [root]
```

### 构建选项

| 选项 | 描述 |
|------|------|
| `--target <target>` | 转译目标（默认：`"modules"`） |
| `--outDir <dir>` | 输出目录（默认：`dist`） |
| `--assetsDir <dir>` | outDir 下的资源目录（默认：`"assets"`） |
| `--assetsInlineLimit <number>` | 内联阈值（字节）（默认：4096） |
| `--ssr [entry]` | 为 SSR 构建 |
| `--sourcemap [output]` | 生成 source maps（`boolean \| "inline" \| "hidden"`） |
| `--minify [minifier]` | 压缩器（`boolean \| "oxc" \| "terser" \| "esbuild"`） |
| `--manifest [name]` | 生成构建 manifest JSON |
| `--ssrManifest [name]` | 生成 SSR manifest JSON |
| `--emptyOutDir` | 强制清空 outDir |
| `-w, --watch` | 监视模式重新构建 |

## 预览

本地预览生产构建：

```bash
vite preview [root]
```

### 预览选项

| 选项 | 描述 |
|------|------|
| `--host [host]` | 指定主机名 |
| `--port <port>` | 指定端口 |
| `--strictPort` | 端口被占用时退出 |
| `--open [path]` | 启动时打开浏览器 |
| `--outDir <dir>` | 输出目录（默认：`dist`） |

## 包脚本

典型的 `package.json` 脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 运行 Vite

```bash
# 使用 npm
npx vite

# 使用 pnpm
pnpm vite

# 使用 yarn
yarn vite

# 使用 bun
bunx vite
```

## 脚手架新项目

```bash
# 交互式提示
npm create vite@latest

# 带项目名称和模板
npm create vite@latest my-app -- --template vue-ts

# 可用模板：vanilla, vanilla-ts, vue, vue-ts, react, react-ts,
# react-swc, react-swc-ts, preact, preact-ts, lit, lit-ts, svelte, svelte-ts,
# solid, solid-ts, qwik, qwik-ts
```

## 调试

```bash
# 调试插件转换
vite --debug plugin-transform

# 带性能分析的调试
vite --profile
# 然后按 'p + enter' 记录 .cpuprofile

# 过滤调试日志
vite --debug -f plugin-transform
```

<!-- 
Source references:
- https://vite.dev/guide/cli.html
-->
