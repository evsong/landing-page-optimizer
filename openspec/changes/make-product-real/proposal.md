## Why

PageScore 的落地页展示了完整的产品功能，但核心分析引擎在 Vercel 上因 Chromium 路径错误无法运行，多个付费功能（Benchmark、PDF导出、白标报告、API）是空壳，支付用的 Stripe 不支持中国大陆开发者。要通过 Creem 支付审核上线收款，必须让所有展示的功能真实可用，并补齐 Privacy Policy 和 Terms of Service 页面。

## What Changes

- 修复 Chromium/Puppeteer：从 `@sparticuz/chromium` 迁移到 `@sparticuz/chromium-min`，解决 Vercel 上二进制文件找不到的问题
- 创建 Privacy Policy 和 Terms of Service 真实页面，更新 Footer 链接
- 修正首页社会证明为真实数据（从数据库查询实际分析次数）
- 实现 Benchmark 评分：基于历史分析数据的百分位排名
- 实现 PDF 导出：用已安装的 `@react-pdf/renderer` 生成真实报告 PDF
- **BREAKING** 替换 Stripe 为 Creem 支付：移除 Stripe 依赖，集成 Creem SDK
- 实现白标报告：Agency 用户可自定义 PDF 品牌（logo、公司名、品牌色）
- 实现公开 API：Agency 用户可通过 API Key 调用分析接口

## Capabilities

### New Capabilities
- `fix-chromium`: 修复 Vercel 上 Puppeteer/Chromium 运行环境，让核心分析引擎正常工作
- `legal-pages`: 创建 Privacy Policy 和 Terms of Service 页面
- `benchmark-scoring`: 基于历史数据的百分位排名评分系统
- `pdf-export`: 报告 PDF 生成和下载功能
- `creem-payment`: Creem 支付集成替换 Stripe（checkout、webhook、plan 管理）
- `whitelabel-reports`: Agency 用户品牌自定义 PDF 报告
- `public-api`: Agency 用户 API Key 认证的公开分析接口

### Modified Capabilities
（无现有 spec 需要修改）

## Impact

- **依赖变更**: 移除 `stripe`、`@sparticuz/chromium`；新增 `creem`、`@sparticuz/chromium-min`
- **数据库**: 新增 `benchmarkStats` 表；User 表加 `brandLogo`、`brandName`、`brandColor`、`apiKey` 字段
- **API 路由**: 新增 `/api/checkout`、`/api/webhooks/creem`、`/api/v1/analyze`、`/api/v1/reports`；删除 `/api/upgrade`、`/api/webhooks/stripe`
- **页面**: 新增 `/privacy`、`/terms`；修改首页社会证明、定价区 CTA
- **环境变量**: 新增 `CREEM_API_KEY`、`CREEM_WEBHOOK_SECRET`；移除 `STRIPE_SECRET_KEY`
