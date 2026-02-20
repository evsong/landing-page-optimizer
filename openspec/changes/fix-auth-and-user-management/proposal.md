## Why

用户登录后首页导航栏仍显示 "Sign In" / "Get Started"，没有退出按钮，没有用户管理页面。Google OAuth 配置了但无凭证导致登录页有无效按钮。整体认证流程不完整，用户体验断裂。

## What Changes

- 删除 Google OAuth provider，signin 页面只保留邮箱 magic link 登录
- 首页导航栏根据 session 状态动态显示：未登录显示 Sign In / Get Started，已登录显示用户邮箱 + Dashboard 入口 + Sign Out
- 添加用户账户设置页面（/settings），展示邮箱、当前 plan、使用量
- 添加 middleware.ts 保护 /dashboard、/settings、/report 等需要登录的路由
- signin 页面登录成功后正确跳转，verify-request 页面提示检查邮箱

## Capabilities

### New Capabilities
- `session-aware-navbar`: 导航栏根据登录状态动态切换显示内容（用户信息/退出 vs 登录入口）
- `user-settings-page`: 用户账户设置页面，显示邮箱、plan、用量统计
- `auth-middleware`: Next.js middleware 保护需要登录的路由，未登录自动跳转 signin

### Modified Capabilities
- （无现有 spec 需要修改）

## Impact

- `src/app/api/auth/[...nextauth]/route.ts` — 删除 GoogleProvider
- `src/app/auth/signin/page.tsx` — 移除 Google 按钮，优化邮箱登录 UI
- `src/app/page.tsx` — 导航栏改为 session-aware 组件
- `src/app/settings/page.tsx` — 新增
- `src/middleware.ts` — 新增
- `src/components/Navbar.tsx` — 新增，抽取导航栏为独立组件
