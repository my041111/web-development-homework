# 课程项目开发指南

本文档提供了课程项目的详细开发指南，特别是WakaTime和QAnything功能的集成说明。

## 项目概述

这个项目使用Next.js创建了一个课程展示网站，包含多个前端开发练习示例和两个特色功能：WakaTime编码时间统计和QAnything大语言模型问答服务。

## WakaTime API集成

### 配置步骤

1. **获取API密钥**
   - 登录 [WakaTime](https://wakatime.com/)
   - 导航至 Settings → Account
   - 复制您的API密钥

2. **设置环境变量**
   - 在项目根目录创建 `.env.local` 文件
   - 添加 `WAKATIME_API_KEY=your_api_key`
   - 对于公开部署，请使用服务器环境变量或密钥管理服务

3. **API调用说明**

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

4. **前端实现**

   WakaTime数据在两个位置展示:
   
   - **全局页脚** (`components/WakaTimeFooter.js`): 简洁显示总时间和语言分布
   - **专用页面** (`app/wakatime/page.js`): 详细展示所有统计信息，包含图表

5. **模拟数据**

   为避免超出API限制，开发时可使用内置的模拟数据:

   - 在API调用中添加 `mock=true` 参数
   - 或通过UI上的切换按钮启用模拟数据

### 数据结构

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

## QAnything集成

QAnything是一个大语言模型问答服务，本项目提供了两种集成方式。

### 基础集成方式 (iframe嵌入)

1. **配置步骤**
   - 在 `.env.local` 设置 `NEXT_PUBLIC_QANYTHING_IFRAME_URL=嵌入页面URL`
   - 基础集成在 `app/qanything/page.js` 的 `BasicIntegration` 组件中实现

2. **实现细节**
   - 使用iframe嵌入外部QAnything页面
   - 支持设置必要的iframe属性，如allow和loading
   - 如未配置URL，则使用HuggingFace Chat作为演示

### 进阶集成方式 (API调用)

1. **配置步骤**
   - 在 `.env.local` 设置:
     ```
     NEXT_PUBLIC_QANYTHING_API_URL=API端点
     USE_REAL_API=true/false
     ```

2. **API实现**
   - API处理在 `/app/api/qanything/route.js` 中
   - 支持真实API调用或本地模拟回答
   - 内置与课程相关的知识库用于本地回答生成

3. **本地知识库**
   - 当未配置真实API或API调用失败时使用
   - 包含HTML、CSS、JavaScript、React和Next.js相关内容
   - 基于关键词匹配从预设回答中选择

4. **前端实现**
   - 在 `app/qanything/page.js` 的 `AdvancedIntegration` 组件中实现
   - 提供简洁的问答界面
   - 支持加载状态和错误处理

### API调用示例

```javascript
// 提问
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

## 开发最佳实践

### 环境变量管理

1. 开发环境
   - 使用 `.env.local` 存储敏感信息
   - 确保 `.env.local` 已添加到 `.gitignore`

2. 生产环境
   - 使用部署平台提供的环境变量管理
   - 避免在代码中硬编码API密钥

### API限流考虑

1. WakaTime API
   - 有请求频率限制，开发时使用mock=true参数
   - 实现本地缓存以减少API调用

2. QAnything API
   - 使用本地模拟响应进行开发和测试
   - 添加错误处理和重试机制

### 展示组件设计

1. 保持一致性
   - 遵循设计系统和颜色主题
   - 使用相同的加载状态和错误处理模式

2. 响应式设计
   - 确保在移动设备上同样可用
   - 针对小屏幕优化数据展示

## 测试

### 手动测试

1. WakaTime功能
   - 验证不同时间范围的数据加载
   - 测试模拟数据模式
   - 验证错误处理

2. QAnything功能
   - 测试基础集成iframe加载
   - 测试进阶集成问答功能
   - 验证API错误处理

### 自动化测试 (推荐添加)

1. 组件测试
   - 使用Jest和React Testing Library测试关键组件
   - 模拟API响应进行测试

2. API测试
   - 验证API路由的响应格式和错误处理
   - 测试不同参数的处理逻辑

## 部署

推荐使用Vercel进行部署:

1. 连接GitHub仓库
2. 配置环境变量
3. 部署应用

其他平台如Netlify和AWS Amplify也可以使用，确保配置正确的构建命令和环境变量。