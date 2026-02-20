## Context

Landing Page Optimizer 使用 NextAuth v4 + Prisma + Email magic link。当前问题：Google OAuth 无凭证但仍配置、导航栏不感知登录状态、无用户管理页、无路由保护。

## Goals / Non-Goals

**Goals:**
- 纯邮箱 magic link 登录，移除 Google OAuth
- 导航栏动态显示登录/未登录状态
- 添加 /settings 用户信息页
- middleware 保护需登录的路由

**Non-Goals:**
- 密码登录、OAuth 集成
- 用户头像上传
- 管理员后台

## Decisions

1. **Navbar 抽为独立 client component** — 使用 `useSession()` 读取状态，放在 layout.tsx 中全局渲染。因为需要 client-side session hook，不能是 server component。

2. **middleware 用 NextAuth v4 的 `withAuth`** — 通过 `next-auth/middleware` 的 `withAuth` 包装，matcher 匹配 `/dashboard`、`/settings`、`/report/:path*`、`/compare`。比手写 JWT 解析更可靠。

3. **Settings 页面用 `useSession` + API 获取用量** — session 中已有 email 和 plan，用量数据通过现有 prisma 查询获取。

## Risks / Trade-offs

- [middleware 依赖 session token cookie] → NextAuth v4 默认使用 database session，middleware 需要能读取 session token。使用 `withAuth` 会自动处理。
- [Navbar 是 client component] → 首次渲染会有 loading 状态闪烁。用 skeleton 或延迟显示缓解。
