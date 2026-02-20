import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { analyzeUrl } from '@/lib/analyzer'
import { prisma } from '@/lib/prisma'
import { checkPlanAccess, incrementAnalysisCount } from '@/lib/plan-gating'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const session = await getServerSession()
    const userId = (session?.user as any)?.id
    const plan = (session?.user as any)?.plan || 'FREE'

    // Rate limit
    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous'
    const rateLimit = checkRateLimit(rateLimitKey, userId ? plan : 'anonymous')
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', resetAt: rateLimit.resetAt }, { status: 429 })
    }

    // Plan gating
    if (userId) {
      const access = await checkPlanAccess(userId, 'analyze')
      if (!access.allowed) {
        return NextResponse.json({ error: access.reason }, { status: 403 })
      }
    }

    // Check 24h cache
    if (userId) {
      const cached = await prisma.analysisReport.findFirst({
        where: {
          url: parsedUrl.toString(),
          userId,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { createdAt: 'desc' },
      })
      if (cached) {
        return NextResponse.json({ reportId: cached.id, cached: true })
      }
    }

    // Run analysis
    const result = await analyzeUrl(parsedUrl.toString())

    // Save report
    const report = await prisma.analysisReport.create({
      data: {
        url: result.finalUrl,
        overallScore: result.scores.overallScore,
        letterGrade: result.scores.letterGrade,
        structureScore: result.scores.structureScore,
        designScore: result.scores.designScore,
        copyScore: result.scores.copyScore,
        conversionScore: result.scores.conversionScore,
        performanceScore: result.scores.performanceScore,
        seoScore: result.scores.seoScore,
        benchmarkScore: result.scores.benchmarkScore,
        accessibilityPenalty: result.scores.accessibilityPenalty,
        frontendQualityIssues: result.scores.frontendQualityIssues as any,
        issues: result.issues as any,
        suggestions: result.suggestions as any,
        copyRewrites: result.copyRewrites as any,
        lighthouseData: (result.lighthouseData || {}) as any,
        pa11yData: result.pa11yData as any,
        harData: result.harData as any,
        extendedMetrics: result.extendedMetrics as any,
        userId: userId || null,
      },
    })

    // Benchmark: percentile rank
    const [totalCount, belowCount] = await Promise.all([
      prisma.analysisReport.count(),
      prisma.analysisReport.count({ where: { overallScore: { lte: report.overallScore } } }),
    ])
    const benchmarkScore = totalCount > 1 ? Math.round((belowCount / totalCount) * 100) : null
    if (benchmarkScore !== null) {
      await prisma.analysisReport.update({ where: { id: report.id }, data: { benchmarkScore } })
    }

    // Increment counter
    if (userId) await incrementAnalysisCount(userId)

    return NextResponse.json({ reportId: report.id })
  } catch (err: any) {
    console.error('Analysis failed:', err)
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 })
  }
}
