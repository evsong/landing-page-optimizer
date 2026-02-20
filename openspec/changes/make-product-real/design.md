## Context

PageScore 是一个 AI 驱动的落地页分析工具，部署在 Vercel 上。核心分析引擎（Puppeteer + Lighthouse + Claude AI）代码完整但因 Chromium 路径问题无法在生产环境运行。多个付费功能是空壳，支付用 Stripe 但不支持中国大陆。需要全面修复让产品真实可用，以通过 Creem 支付审核。

技术栈：Next.js 16 + Prisma + Neon PostgreSQL + NextAuth + Tailwind CSS v4

## Goals / Non-Goals

**Goals:**
- 让核心分析引擎在 Vercel 上正常运行
- 所有展示的功能真实可用（Benchmark、PDF、白标、API）
- 用 Creem 替换 Stripe 支付
- 补齐法律页面（Privacy/Terms）
- 通过 Creem 账户审核

**Non-Goals:**
- 不改变分析算法或评分逻辑
- 不增加新的分析维度
- 不做移动端 App
- 不做多语言支持

## Decisions

### D1: Chromium 方案 — @sparticuz/chromium-min
**选择**: 用 `@sparticuz/chromium-min` 替换 `@sparticuz/chromium`
**原因**: chromium-min 运行时从 CDN 下载二进制，避免包体积问题。改动最小，只需修改 browser 初始化代码。
**替代方案**: Google PageSpeed API（丢失截图和DOM分析能力）、外部截图服务（额外成本和依赖）

### D2: Benchmark 实现 — 简单百分位排名
**选择**: 在 analysisReport 表上直接 COUNT 查询计算百分位
**原因**: 无需新表，利用现有数据。SQL: `SELECT COUNT(*) FROM analysisReport WHERE totalScore <= ?` / `SELECT COUNT(*) FROM analysisReport`
**替代方案**: 维护独立统计表（过度工程）、外部基准数据库（不存在）

### D3: PDF 生成 — 服务端 React PDF
**选择**: 用 `@react-pdf/renderer` 在 API route 中服务端渲染 PDF
**原因**: 已安装该依赖，服务端渲染避免客户端大包。通过 `/api/report/[id]/pdf` 返回 PDF stream。
**替代方案**: 客户端 jsPDF（包大、体验差）、Puppeteer 打印 PDF（已有 Chromium 但增加复杂度）

### D4: Creem 集成 — 官方 SDK
**选择**: 用 `creem` npm 包，checkout session + webhook 模式
**原因**: 官方 SDK，类型安全，API 简洁。流程：前端调 `/api/checkout` → 后端创建 Creem session → 重定向到 Creem 支付页 → webhook 回调更新 plan。
**替代方案**: 直接调 REST API（无类型安全）、支付链接（无法自动更新 plan）

### D5: API 认证 — Bearer Token
**选择**: 用户在 Settings 生成 API Key，存入 User 表，请求时通过 `Authorization: Bearer <key>` 认证
**原因**: 简单直接，无需额外认证服务。限流用内存 Map + 滑动窗口（Vercel serverless 每个实例独立，足够用）。
**替代方案**: OAuth2（过度工程）、JWT（无状态但需要额外签名逻辑）

### D6: 数据库变更
User 表新增字段：
- `brandLogo` String? — 白标 logo URL
- `brandName` String? — 白标公司名
- `brandColor` String? — 白标品牌色
- `apiKey` String? @unique — API 密钥

无需新表，Benchmark 直接查询 analysisReport。

## Risks / Trade-offs

- **chromium-min 冷启动慢** → 首次分析可能需要额外 5-10s 下载 Chromium。可接受，后续请求复用 /tmp 缓存。
- **Vercel 函数超时** → Pro 计划 60s 限制。Lighthouse + AI 分析可能接近上限。→ 确保 maxDuration 配置正确。
- **Creem SDK 稳定性** → 相对新的 SDK。→ 做好错误处理，webhook 幂等。
- **内存限流不持久** → Vercel serverless 实例重启后限流重置。→ 对 Agency 用户可接受，不会被滥用。

## Migration Plan

1. 先修 Chromium（P0），验证分析引擎能跑
2. 加法律页面（P0），不影响现有功能
3. 实现 Benchmark + PDF（P1），数据库 migration
4. 集成 Creem、删除 Stripe（P1），需要 Creem 后台创建产品
5. 实现白标 + API（P2），数据库 migration
6. 全部完成后提交 Creem 审核

回滚：每步独立 commit，可单独 revert。
