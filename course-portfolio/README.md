# Next.js 全栈开发实践项目

## 1. 项目简介

本项目是一个基于 Next.js 和 Tailwind CSS 构建的全栈 Web 应用，旨在展示和管理 Web 前端技术的学习与实践成果。项目集成了多项外部服务与 API，包括：

- **GitHub API**：动态拉取并展示指定仓库的文件和目录结构，支持仓库创建与文件提交。
- **QAnything 知识库问答**：提供两种路径的智能问答机器人界面，用户可以提出问题并获得解答。
- **WakaTime API**：通过 Cloudflare Worker 中继，展示个人的编程活动统计数据。
- **旧作业整合**：将之前完成的 HTML、CSS、JavaScript 等练习作业整合到统一平台。

项目前端采用响应式设计，后端逻辑通过 Next.js API Routes 实现，整体体现了现代 Web 开发的"约定优于配置"原则。通过这个项目，展示了从基础 Web 技术到现代前端框架的学习进阶过程。

![项目首页](/screenshots/homepage-new.png)

## 2. QAnything 集成路径与实现细节

为了将 QAnything 知识库问答功能集成到项目中，我们提供了两种不同的实现路径，满足不同的使用需求。

### 2.1 两种集成路径

- **基础路径**：通过 iframe 直接嵌入官方 QAnything 对话界面，简单直接，无需额外 API 调用。

![QAnything基础路径](/screenshots/qanything-advanced.png)

- **进阶路径**：自定义前端界面，通过 Next.js API 路由调用 QAnything API，实现更灵活的定制化问答体验。

![QAnything进阶路径](/screenshots/qanything-basic.png)

### 2.2 实现细节

- **路径选择**：
  - **前端页面**：`src/app/qanything/page.js`，作为问答功能的入口页面，提供两种模式切换按钮。
  - **自定义组件**：`src/components/QAnythingChat.js`，实现进阶路径的聊天界面。
  - **后端 API 路由**：`src/app/api/qanything/route.js`，作为代理服务器，负责安全地调用外部 API。

- **实现原因与技术细节**：
  - **安全性**：直接在前端调用 API 会暴露 `API Key`。通过在 Next.js 中创建一个后端 API 路由作为中介，可以将 `API Key` 等敏感信息存储在服务器端环境变量中（`.env.local`），避免了客户端泄露风险。
  - **逻辑分离**：前端组件专注于 UI 交互，后端路由处理数据请求和业务逻辑，符合关注点分离原则。
  - **流式响应**：实现了 SSE（Server-Sent Events）流式响应，使聊天回复能够逐步显示，提升用户体验。
  - **错误处理**：添加了完善的错误处理机制，在 API 调用失败时提供友好的错误提示和备用响应。
  - **聊天历史**：进阶路径实现了聊天历史记录功能，支持上下文理解和连续对话。

## 3. WakaTime API 集成方法

为了展示编程时长统计，我们集成了 WakaTime API，并通过 Cloudflare Worker 作为数据中继。

### 3.1 集成组件

- **页面组件**：`src/app/wakatime/page.js` 是一个客户端组件，负责展示完整的编程统计数据。
- **页脚组件**：`src/components/WakaTimeFooter.js` 是一个轻量级组件，在全站页脚显示简要的编程语言分布情况。
- **API 路由**：`src/app/api/wakatime/route.js` 处理数据请求，并在 API 不可用时提供备用模拟数据。

![WakaTime统计页面](/screenshots/dashboard-wakatime.png)

### 3.2 数据中继与实现流程

- **Cloudflare Worker**：我们部署了一个独立的 Cloudflare Worker (`my-wakatime-worker`)，它负责调用 WakaTime API。这样做的好处是：
  1. **隐藏 API 密钥**：WakaTime API 密钥安全地存储在 Worker 的环境变量中。
  2. **解决 CORS 问题**：浏览器直接请求 WakaTime API 会遇到跨域限制，Worker 作为代理可以解决此问题。
  3. **缓存与性能**：在 Worker 层添加缓存逻辑，减少对 WakaTime API 的请求频率。

- **实现流程**：
  1. 前端组件在加载时向我们的 API 路由发送请求
  2. API 路由尝试调用 Cloudflare Worker
  3. Worker 使用预设的 API 密钥调用 WakaTime API
  4. Worker 将获取到的数据处理后返回给前端
  5. 前端组件将数据显示为图表和统计信息

### 3.3 备用数据机制

为了确保即使在 API 不可用或限流的情况下，页面仍能正常显示，我们实现了一个备用数据机制。系统会在本地存储一份最近的有效数据，当 API 请求失败时，自动使用这份备用数据。

## 4. GitHub 集成功能

项目集成了 GitHub API，实现了以下功能：

### 4.1 仓库浏览

- 支持通过用户名搜索 GitHub 仓库
- 显示仓库基本信息（名称、描述、更新时间、主要语言等）
- 查看仓库的提交历史

![GitHub仓库管理界面](/screenshots/github-repos.png)