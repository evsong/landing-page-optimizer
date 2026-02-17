# Landing Page Optimizer — Brainstorming Results

> 日期：2026-02-17
> 状态：5个核心决策已确认，准备进入 Spec 设计阶段

---

## 产品概况

| 项目 | 内容 |
|------|------|
| **产品名** | Landing Page Optimizer (暂定) |
| **关键词** | landing page analyzer (170K/月, KD 15%) |
| **一句话定位** | AI驱动的落地页分析工具——输入URL，获得综合评分和可执行的优化建议 |
| **目标用户** | 营销人员、SaaS创始人、电商卖家、广告投手、Agency |
| **核心差异** | 不只告诉你哪里有问题，还告诉你具体怎么改 |
| **技术栈** | Next.js + TailwindCSS + Prisma + PostgreSQL + Vercel |
| **部署** | Vercel 全托管 |
| **GitHub** | github.com/evsong/landing-page-optimizer (待创建) |

---

## 5个核心决策

### 决策1: MVP范围 → 全功能MVP

**选择**: 分析 + 竞品对比 + AI重写建议 + PDF报告 + 历史追踪

**功能清单**:
- 输入URL → 综合分析报告（7个维度评分）
- 输入竞品URL → 并排对比分析
- AI可执行优化建议（文案重写、CTA优化、布局调整）
- PDF报告导出（白标支持）
- 历史分析记录追踪
- 用户系统（NextAuth）
- Plan Gating（FREE/PRO/AGENCY）

**风险**: 开发周期比纯分析器长，预计需要2-3天完成全部功能。

### 决策2: 差异化 → AI可执行建议

**核心卖点**: "不只给分数，还告诉你具体怎么改"

**具体表现**:
- 标题不够吸引？AI直接给出3个重写版本
- CTA不够明显？AI建议具体的颜色、位置、文案调整
- 首屏缺少价值主张？AI生成适合该行业的价值主张文案
- 页面加载慢？给出具体的图片压缩、代码优化步骤

**竞品对比**:
| 工具 | 给数据 | 给建议 | 给可执行方案 |
|------|--------|--------|-------------|
| PageSpeed Insights | ✅ | ✅ 技术建议 | ❌ |
| Hotjar | ✅ 行为数据 | ❌ | ❌ |
| GTmetrix | ✅ | ✅ 技术建议 | ❌ |
| **我们** | ✅ | ✅ | ✅ AI生成具体方案 |

### 决策3: 数据获取 → Puppeteer + Lighthouse + AI Vision

**三层分析架构**:

```
Layer 1: Puppeteer
├── 加载页面，等待渲染完成
├── 截取全页截图（用于AI Vision）
├── 提取DOM结构（用于自定义规则引擎）
└── 生成HAR文件（用于资源分析）

Layer 2: Lighthouse Node API
├── Performance 评分 (LCP, FID, CLS, TBT, Speed Index)
├── Accessibility 评分 (axe-core)
├── Best Practices 评分
└── SEO 评分

Layer 3: AI Vision (Claude/GPT-4o)
├── 视觉设计质量评分
├── 配色协调度分析
├── 布局美感评估
├── 品牌一致性检查
└── 生成可执行优化建议
```

**成本估算**:
- Puppeteer + Lighthouse: 服务器计算成本（Vercel Serverless）
- AI Vision: ~$0.01-0.03/次（Claude Haiku 或 GPT-4o-mini）
- AI 建议生成: ~$0.01-0.02/次
- 总计: ~$0.03-0.05/次分析

### 决策4: 技术架构 → Vercel 全托管

**架构图**:
```
用户浏览器
    │
    v
Next.js App (Vercel)
    ├── 前端页面 (React + TailwindCSS)
    ├── API Routes
    │   ├── POST /api/analyze — 提交分析任务
    │   ├── GET /api/report/[id] — 获取报告
    │   ├── POST /api/compare — 竞品对比
    │   └── GET /api/history — 历史记录
    │
    ├── Serverless Functions (分析引擎)
    │   ├── @sparticuz/chromium (轻量Puppeteer)
    │   ├── lighthouse (Node API)
    │   ├── 自定义规则引擎
    │   └── AI API 调用 (Claude/OpenAI)
    │
    └── Prisma + PostgreSQL (Neon)
        ├── User
        ├── AnalysisReport
        ├── ComparisonReport
        └── Subscription
```

**关键技术点**:
- Puppeteer 在 Vercel: 使用 `@sparticuz/chromium` (~50MB)
- 超时: Vercel Pro 最长 300秒，免费版 60秒（够用）
- 并发: Vercel 自动伸缩，无需手动管理
- 数据库: Neon PostgreSQL (Serverless, 免费层够用)

### 决策5: 商业模式 → 低价策略

**定价**:

| Plan | 价格 | 分析次数 | 功能 |
|------|------|---------|------|
| **FREE** | $0 | 3次/月 | 基础7维度评分 + 摘要建议 |
| **PRO** | $5.99/月 | 无限 | AI详细建议 + 历史追踪 + 文案重写 |
| **AGENCY** | $49/月 | 无限 | 批量分析 + 竞品对比 + 白标PDF + API |

**获客策略**:
- 免费工具天然有病毒传播属性（"看看你的落地页能得几分"）
- SEO: 目标关键词 KD 15%，可快速排名
- 内容营销: landing page best practices (5K-10K/月搜索量)
- Product Hunt launch

**单位经济**:
- 免费用户成本: 3次 × $0.05 = $0.15/月/用户
- PRO 用户假设20次/月: 20 × $0.05 = $1.00/月，毛利 $4.99 (83%)
- AGENCY 用户假设100次/月: 100 × $0.05 = $5.00/月，毛利 $44 (90%)

---

## 7个评分维度详细设计

### 1. 结构完整度 (Structure Score)
**检测方式**: DOM 分析
- Hero Section 是否存在（h1 + 副标题 + CTA）
- Social Proof（客户Logo、数字指标）
- How It Works（步骤说明）
- Features Section
- Testimonials（推荐语）
- Pricing Table
- FAQ
- CTA / Lead Capture Form
- Footer（链接、法律信息）

### 2. 视觉设计 (Design Score)
**检测方式**: AI Vision（截图分析）
- 配色协调度
- 字体选择和层级
- 留白和间距
- 视觉层次
- 品牌一致性
- 移动端适配视觉

### 3. 文案质量 (Copy Score)
**检测方式**: DOM 提取文本 + AI 分析
- 标题清晰度和吸引力
- 价值主张是否明确
- CTA 文案行动力
- 文案长度适当性
- 语法和拼写

### 4. 转化优化 (Conversion Score)
**检测方式**: DOM 分析 + 自定义规则
- CTA 数量和位置（首屏是否有CTA）
- 表单字段数量（越少越好）
- 信任标志（安全徽章、客户Logo、数据指标）
- 紧迫感元素
- 社会证明强度
- 退出意图处理

### 5. 技术性能 (Performance Score)
**检测方式**: Lighthouse
- Core Web Vitals (LCP, FID/INP, CLS)
- Speed Index
- Total Blocking Time
- 首次内容绘制 (FCP)

### 6. SEO 基础 (SEO Score)
**检测方式**: Lighthouse + DOM 分析
- Title 标签（长度、关键词）
- Meta Description
- OG Image 和 OG Tags
- Heading 层级 (h1→h2→h3)
- 图片 Alt 文本
- Canonical URL
- 结构化数据 (Schema.org)

### 7. 行业基准 (Benchmark Score)
**检测方式**: 数据库对比
- 与同行业落地页平均分对比
- 百分位排名
- 行业最佳实践对标
- 随数据积累逐步完善

---

## 页面规划

### Landing Page (首页)
- Hero: "你的落地页能得几分？" + URL输入框 + 分析按钮
- 示例报告预览
- 7个维度介绍
- 定价表
- FAQ
- Footer

### Analysis Report Page (报告页)
- 综合评分（环形图）
- 7个维度分数条
- 每个维度的详细问题列表
- AI 优化建议（可展开）
- 文案重写建议（PRO）
- 页面截图预览
- 导出PDF按钮（AGENCY）

### Compare Page (对比页, AGENCY)
- 左右并排两个URL的报告
- 逐维度对比
- 优劣势总结

### Dashboard (仪表盘)
- 历史分析列表
- 分数趋势图
- 剩余分析次数

---

## 开发计划（参考 Playbook）

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| ✅ 研究 | 竞品 + GitHub + 灵感站 | 已完成 |
| ✅ Brainstorming | 5个核心决策 | 已完成 |
| → Spec 设计 | OpenSpec / GudaSpec | 0.5天 |
| → Logo | svg-logo-designer | 0.5小时 |
| → 前端原型 | frontend-design | 0.5天 |
| → 实现 | MVP 全功能 | 2-3天 |
| → 测试 | Chrome DevTools MCP | 0.5天 |
| → 部署 | Vercel + 域名 | 0.5天 |

---

## 竞品一句话总结

- **Unbounce**: 构建器+AI分流，$187/月，不分析外部页面
- **Instapage**: 广告落地页专用，$199/月，AdMap独家
- **Leadpages**: 性价比构建器，$49/月，功能最基础
- **PageSpeed Insights**: 免费性能检测，不看内容和转化
- **GTmetrix**: 免费+付费性能监控，API友好
- **Hotjar**: 免费行为分析，不给优化建议
- **Crazy Egg**: 热力图+A/B测试，$29/月起
- **VWO**: 企业级CRO，模块化定价
- **Optimizely**: 企业级实验平台，$50K+/年

**我们的位置**: 填补"免费/低价 + 综合分析 + AI可执行建议"的市场空白。
