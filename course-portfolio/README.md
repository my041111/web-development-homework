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

### 4.2 仓库创建

- 提供表单创建新的 GitHub 仓库
- 支持设置仓库名称、描述、可见性等属性
- 可选择是否初始化 README 文件

### 4.3 代码提交

- 支持向指定仓库提交代码文件
- 提供文件内容编辑器
- 支持添加提交信息

### 4.4 错误处理

- 完善的错误处理机制，特别是针对 API 限流（403）错误
- 友好的错误提示，帮助用户理解问题并提供解决方案

## 5. Next.js 项目结构与旧作业整合

项目遵循 Next.js App Router 的标准目录结构，并通过特定的路由组织整合了旧的练习作业。

### 5.1 项目目录结构

```
/
├── app/                    # App Router 的根目录
│   ├── api/               # API 路由目录
│   │   ├── qanything/    # QAnything API 路由
│   │   │   └── route.js  # API 路由处理文件
│   │   └── wakatime/     # WakaTime API 路由
│   │       └── route.js  # API 路由处理文件
│   ├── qanything/        # QAnything 页面
│   │   ├── page.js       # QAnything 页面组件
│   │   └── qanything-chat.css # 聊天界面样式
│   ├── wakatime/         # WakaTime 页面
│   │   └── page.js       # WakaTime 页面组件
│   ├── github/           # GitHub 集成页面
│   │   └── page.js       # GitHub 页面组件
│   ├── exercises/        # 练习展示页面
│   │   ├── layout.js     # 练习页面布局
│   │   ├── page.js       # 练习展示页面组件
│   │   ├── css-styling/  # CSS 练习
│   │   ├── html-basics/  # HTML 练习
│   │   ├── js-interaction/ # JavaScript 练习
│   │   ├── react-components/ # React 组件练习
│   │   ├── nextjs-routing/ # Next.js 路由练习
│   │   └── web-homework/ # 旧作业整合目录
│   │       ├── 01-web/   # Web 基础作业
│   │       ├── 03-css/   # CSS 作业
│   │       ├── 05-news/  # 新闻页面作业
│   │       └── 06-news/  # 进阶新闻页面作业
│   ├── globals.css       # 全局样式文件
│   ├── layout.js         # 根布局组件
│   └── page.js           # 首页组件
├── components/           # 共享组件目录
│   ├── GitHubCommitCreator.js # GitHub 提交组件
│   ├── GitHubRepoCreator.js # GitHub 仓库创建组件
│   ├── KaleidoscopeBackground.js # 动态背景组件
│   ├── QAnythingChat.js # QAnything 聊天组件
│   └── WakaTimeFooter.js # WakaTime 页脚组件
├── my-wakatime-worker/   # Cloudflare Worker 项目
│   ├── src/             # Worker 源代码
│   │   └── index.js     # Worker 入口文件
│   └── wrangler.toml    # Worker 配置文件
├── public/               # 静态资源目录
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── wakatime-logo.svg
│   └── window.svg
├── .env.local.example    # 环境变量示例文件
├── .gitignore            # Git 忽略文件
├── next.config.js        # Next.js 配置文件
├── package.json          # 项目依赖配置
├── postcss.config.js     # PostCSS 配置
└── tailwind.config.js    # Tailwind CSS 配置
```

### 5.2 旧作业整合方法

我们通过 Next.js 的文件系统路由功能，将之前完成的各类作业整合到了统一的平台中：

1. **路由组织**：在 `app/exercises/web-homework/` 目录下，按照作业类型和编号创建子目录，每个子目录包含一个 `page.js` 文件作为该作业的入口。

2. **共享布局**：使用 `app/exercises/layout.js` 为所有练习提供统一的导航和布局，方便用户在不同练习之间切换。

3. **技术升级**：将原本的静态 HTML/CSS/JavaScript 作业改造为 React 组件形式，同时保留原有的功能和样式。

4. **渐进式学习展示**：通过不同作业的组织，展示了从基础 Web 技术到现代前端框架的学习进阶过程。

## 6. 项目功能展示

### 6.1 首页

首页展示了项目的四个主要功能模块：练习展示、QAnything 知识库问答、WakaTime 统计和 GitHub 仓库管理。每个模块都有对应的卡片，点击可以跳转到相应的功能页面。

### 6.2 QAnything 知识库问答

QAnything 知识库问答页面提供了两种模式：

#### 基础路径模式

通过 iframe 直接嵌入官方 QAnything 对话界面，简单直接。用户可以直接在嵌入的界面中与知识库进行对话，无需额外的配置。

#### 进阶路径模式

自定义前端界面，通过 Next.js API 路由调用 QAnything API，实现更灵活的定制化问答体验。特点包括：

- 自定义聊天界面，与整体网站风格一致
- 支持聊天历史记录和上下文理解
- 流式响应，实时显示回答内容
- 显示引用来源和相关度评分
- 支持清除聊天记录功能

### 6.3 WakaTime 统计

WakaTime 统计页面展示了个人的编程活动统计数据，包括：

- 编程语言分布饼图
- 每日编码时间柱状图
- 编辑器使用情况统计
- 项目工作时间分布
- 总编码时间和日均编码时间

页脚组件还在全站范围内显示简要的编程语言分布情况，让用户随时了解自己的编程活动。

### 6.4 GitHub 仓库管理

GitHub 仓库管理页面提供了三个主要功能标签：

#### 仓库浏览

- 支持通过用户名搜索 GitHub 仓库
- 显示仓库列表，包含名称、描述、更新时间等信息
- 点击仓库可查看其提交历史
- 支持仓库内容搜索过滤

#### 仓库创建

- 提供表单创建新的 GitHub 仓库
- 支持设置仓库名称、描述、可见性等属性
- 可选择是否初始化 README 文件
- 创建成功后自动刷新仓库列表

#### 代码提交

- 支持向指定仓库提交代码文件
- 提供文件内容编辑器
- 支持添加提交信息和路径
- 提交成功后可查看更新的提交历史

### 6.5 练习展示

练习展示页面列出了所有的 Web 开发练习，包括：

- HTML 基础练习
- CSS 样式练习
- JavaScript 交互练习
- React 组件练习
- Next.js 路由练习
- 旧作业项目展示

每个练习都有对应的卡片，点击可以查看详情和实际效果。

## 7. 项目运行指南

请按照以下步骤在本地运行本项目：

### 7.1 环境准备

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Edge 等）
- 可选：GitHub 账号（用于 GitHub 集成功能）
- 可选：WakaTime 账号（用于 WakaTime 统计功能）

![项目运行截图](/screenshots/57295897693c2238b1e8e7e8918700b.png)

### 7.2 安装与配置

1. **克隆仓库**
```bash
git clone <your-repository-url>
cd course-portfolio
```

2. **安装依赖**
```bash
npm install
```

3. **环境变量配置**
   - 复制 `.env.local.example` 文件为 `.env.local`
   - 根据需要配置以下环境变量：
   ```
   # WakaTime API 配置
   WAKATIME_API_KEY=your_api_key
   
   # QAnything 配置
   NEXT_PUBLIC_QANYTHING_API_URL=API端点
   NEXT_PUBLIC_QANYTHING_IFRAME_URL=嵌入页面URL
   USE_REAL_API=true/false
   
   # GitHub 配置（如需使用GitHub功能）
   GITHUB_TOKEN=your_github_token
   ```

4. **启动开发服务器**
```bash
npm run dev
```

### 7.3 API 使用说明

#### WakaTime API

WakaTime API在 `/app/api/wakatime/route.js` 中实现。主要功能有：

- 支持不同时间范围: `last_7_days`, `last_30_days`, `last_6_months`, `last_year`, `all_time`
- 获取总编码时间
- 获取语言使用统计
- 获取编辑器使用情况
- 模拟模式供开发测试

API调用示例:
```javascript
// 获取最近30天数据
fetch('/api/wakatime?range=last_30_days')

// 获取所有时间数据
fetch('/api/wakatime?range=all_time')

// 使用模拟数据（开发测试用）
fetch('/api/wakatime?range=last_30_days&mock=true')
```

##### WakaTime 数据结构

WakaTime API返回的数据结构如下:

```javascript
{
  data: {
    best_day: { date: "2023-05-15", text: "4 hrs 12 mins" },
    categories: [ ... ],
    daily_average: 8460,
    editors: [ ... ],
    human_readable_daily_average: "2 hrs 21 mins",
    human_readable_total: "70 hrs 30 mins",
    languages: [ ... ],
    operating_systems: [ ... ],
    total_seconds: 253800
  },
  allTimeTotal: { // 仅在range=all_time时存在
    decimal: "443.00",
    text: "443 hrs",
    total_seconds: 1594800,
    ...
  }
}
```

#### QAnything API

QAnything API在 `/app/api/qanything/route.js` 中实现。

```javascript
// 提问示例
const askQuestion = async (question) => {
  const response = await fetch('/api/qanything', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  
  const data = await response.json();
  return data.answer;
};
```

### 7.4 开发最佳实践

#### 环境变量管理

1. **开发环境**
   - 使用 `.env.local` 存储敏感信息
   - 确保 `.env.local` 已添加到 `.gitignore`

2. **生产环境**
   - 使用部署平台提供的环境变量管理
   - 避免在代码中硬编码API密钥

#### API限流考虑

1. **WakaTime API**
   - 有请求频率限制，开发时使用mock=true参数
   - 实现本地缓存以减少API调用

2. **QAnything API**
   - 使用本地模拟响应进行开发和测试
   - 添加错误处理和重试机制

#### 展示组件设计

1. **保持一致性**
   - 遵循设计系统和颜色主题
   - 使用相同的加载状态和错误处理模式

2. **响应式设计**
   - 确保在移动设备上同样可用
   - 针对小屏幕优化数据展示

### 7.5 测试

#### 手动测试

1. **WakaTime功能**
   - 验证不同时间范围的数据加载
   - 测试模拟数据模式
   - 验证错误处理

2. **QAnything功能**
   - 测试基础集成iframe加载
   - 测试进阶集成问答功能
   - 验证API错误处理

#### 自动化测试 (推荐添加)

1. **组件测试**
   - 使用Jest和React Testing Library测试关键组件
   - 模拟API响应进行测试

2. **API测试**
   - 验证API路由的响应格式和错误处理
   - 测试不同参数的处理逻辑

### 7.6 部署

推荐使用Vercel进行部署:

1. 连接GitHub仓库
2. 配置环境变量
3. 部署应用

其他平台如Netlify和AWS Amplify也可以使用，确保配置正确的构建命令和环境变量。