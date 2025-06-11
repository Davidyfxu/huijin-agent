# 汇金智能体 (HuiJin Agent)

基于阿里云百炼智能平台打造的现代化 AI 智能体网站，提供专业的金融咨询和智能问答服务。

## ✨ 功能特性

- **🤖 智能问答**: 基于百炼智能的高级 AI 模型，提供精准的智能问答服务
- **⚡ 实时响应**: 毫秒级响应，支持流式输出，带来极致的交互体验
- **🔄 多轮对话**: 支持上下文记忆，让对话更自然流畅
- **📚 知识库**: 集成丰富的金融知识库，为您提供专业的金融咨询
- **🎨 现代化 UI**: 科技感十足的界面设计，玻璃态效果和动画
- **📱 响应式设计**: 支持桌面端和移动端访问

## 🛠️ 技术栈

- **前端框架**: Next.js 15.3.3 + React 19
- **AI 平台**: 阿里云百炼智能 (DashScope)
- **UI 组件**: Tailwind CSS + Headless UI
- **动画效果**: Framer Motion
- **图标库**: Lucide React
- **语法高亮**: React Syntax Highlighter
- **通知提示**: React Hot Toast
- **Markdown**: React Markdown

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 🔧 配置说明

### 百炼智能 API 配置

在 `app/api/chat/route.ts` 中配置您的百炼智能 API 密钥：

```typescript
const DASHSCOPE_API_KEY = "your-api-key";
const APP_ID = "your-app-id";
```

### 环境变量 (可选)

创建 `.env.local` 文件：

```env
DASHSCOPE_API_KEY=your-api-key
APP_ID=your-app-id
```

## 📁 项目结构

```
huijin-agent/
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   └── chat/          # 聊天API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── public/                # 静态资源
├── package.json          # 项目配置
└── README.md            # 项目文档
```

## 🎨 UI 特性

### 科技感背景

- 动态星空效果
- 渐变色背景
- 霓虹灯文字效果

### 玻璃态设计

- 毛玻璃效果
- 半透明元素
- 边框高光

### 动画效果

- 页面加载动画
- 消息滑入动画
- 按钮悬停效果
- 打字指示器

## 🌟 功能亮点

### 智能对话

- 支持多轮连续对话
- 消息历史记录
- 实时打字状态显示

### 用户体验

- 快捷问题建议
- 一键清空对话
- 自动滚动到最新消息
- 错误提示和重试机制

### 响应式布局

- 桌面端侧边栏显示功能特性
- 移动端优化的紧凑布局
- 自适应消息气泡

## 🔗 API 文档

### 聊天接口

**POST /api/chat**

请求体：

```json
{
  "message": "用户消息",
  "sessionId": "会话ID（可选）"
}
```

响应：

```json
{
  "message": "AI回复",
  "sessionId": "会话ID",
  "success": true
}
```

### 流式响应（实验性）

**GET /api/chat?message=xxx&sessionId=xxx**

返回 Server-Sent Events 流式响应。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [阿里云百炼智能](https://bailian.console.aliyun.com/) - 提供强大的 AI 能力
- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 流畅的动画库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/huijin-agent/issues)
- 邮箱: your-email@example.com

---

⚡ 由 [汇金团队](https://github.com/your-organization) 用 ❤️ 打造
