# 国际清真食品贸易平台（IHFTP）前端

本项目为 **国际清真食品贸易平台（International Halal Food Trade Platform）** 的官方网站前端，基于 Next.js + React + Tailwind CSS 构建。

---

## 技术栈

- **框架：** [Next.js](https://nextjs.org) 16（App Router）
- **前端库：** React 19
- **样式方案：** Tailwind CSS v4
- **UI 组件：** [shadcn/ui](https://ui.shadcn.com)（base-nova 风格）
- **图标：** Lucide React
- **字体：** Geist / Geist Mono（通过 `next/font` 自动优化加载）
- **语言：** TypeScript

---

## 快速开始

在项目根目录下安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

开发服务器默认运行在 [http://localhost:3000](http://localhost:3000)。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器（需先执行 build） |
| `npm run lint` | 运行 ESLint 代码检查 |

---

## 项目结构

```
web/
├── src/
│   ├── app/                 # Next.js App Router 路由与页面
│   │   ├── page.tsx         # 首页
│   │   ├── layout.tsx       # 根布局（字体、Metadata）
│   │   └── globals.css      # 全局样式与 Tailwind 入口
│   ├── components/
│   │   ├── ui/              # shadcn/ui 基础组件
│   │   ├── layout/          # 布局组件（TopBar、Navbar、Footer）
│   │   ├── sections/        # 首页各区块组件
│   │   └── shared/          # 可复用业务组件（卡片等）
│   └── lib/
│       ├── utils.ts         # 工具函数（cn 等）
│       └── data.ts          # Mock 数据与类型定义
├── public/                  # 静态资源
├── next.config.ts           # Next.js 配置文件
├── components.json          # shadcn/ui 配置
└── package.json
```

---

## 当前进度

- ✅ 首页完整实现（13 个模块：通栏、导航、Hero、信任背书、品类、产品、供应商、服务、数据、项目、资讯、CTA、页脚）
- ⏳ 子页面待开发（产品大厅、供应商列表、平台介绍、入驻申请等）
- ⏳ 多语言国际化（i18n）待接入
- ⏳ 后端 API 与认证系统待对接

---

## 部署

推荐使用 [Vercel](https://vercel.com) 进行部署，也可通过 Docker 或其他 Node.js 托管平台运行。

---

> **注意：** 本项目由 `create-next-app` 初始化创建。如需了解 Next.js 的更多特性，请访问 [Next.js 官方文档](https://nextjs.org/docs)。
