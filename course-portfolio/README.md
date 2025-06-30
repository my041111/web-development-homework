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