import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-auth'
import { checkApiRateLimit } from '@/lib/api-rate-limit'
import { analyzeUrl } from '@/lib/analyzer'
import { prisma } from '@/lib/prisma'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user || user.plan !== 'AGENCY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await checkApiRateLimit(user.id))) {
    return NextResponse.json({ error: 'Rate limit exceeded (10/min)' }, { status: 429 })
  }

  const { url } = await req.json()
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const result = await analyzeUrl(parsedUrl.toString())

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
      userId: user.id,
    },
  })

  return NextResponse.json({
    id: report.id,
    url: report.url,
    overallScore: report.overallScore,
    letterGrade: report.letterGrade,
    scores: {
      structure: report.structureScore,
      design: report.designScore,
      copy: report.copyScore,
      conversion: report.conversionScore,
      performance: report.performanceScore,
      seo: report.seoScore,
      benchmark: report.benchmarkScore,
    },
    issues: result.issues,
    suggestions: result.suggestions,
  })
}
