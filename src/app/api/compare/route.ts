import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeUrl } from '@/lib/analyzer'
import { prisma } from '@/lib/prisma'
import { checkPlanAccess } from '@/lib/plan-gating'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 120

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkPlanAccess(userId, 'compare')
  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 })
  }

  const { urlA, urlB } = await req.json()
  if (!urlA || !urlB) {
    return NextResponse.json({ error: 'Two URLs required' }, { status: 400 })
  }

  // Run both analyses in parallel
  const [resultA, resultB] = await Promise.all([
    analyzeUrl(urlA),
    analyzeUrl(urlB),
  ])

  // Save both reports
  const [reportA, reportB] = await Promise.all([
    prisma.analysisReport.create({
      data: {
        url: resultA.finalUrl,
        overallScore: resultA.scores.overallScore,
        letterGrade: resultA.scores.letterGrade,
        structureScore: resultA.scores.structureScore,
        designScore: resultA.scores.designScore,
        copyScore: resultA.scores.copyScore,
        conversionScore: resultA.scores.conversionScore,
        performanceScore: resultA.scores.performanceScore,
        seoScore: resultA.scores.seoScore,
        benchmarkScore: resultA.scores.benchmarkScore,
        accessibilityPenalty: resultA.scores.accessibilityPenalty,
        issues: resultA.issues as any,
        suggestions: resultA.suggestions as any,
        copyRewrites: resultA.copyRewrites as any,
        lighthouseData: (resultA.lighthouseData || {}) as any,
        pa11yData: resultA.pa11yData as any,
        harData: resultA.harData as any,
        extendedMetrics: resultA.extendedMetrics as any,
        userId,
      },
    }),
    prisma.analysisReport.create({
      data: {
        url: resultB.finalUrl,
        overallScore: resultB.scores.overallScore,
        letterGrade: resultB.scores.letterGrade,
        structureScore: resultB.scores.structureScore,
        designScore: resultB.scores.designScore,
        copyScore: resultB.scores.copyScore,
        conversionScore: resultB.scores.conversionScore,
        performanceScore: resultB.scores.performanceScore,
        seoScore: resultB.scores.seoScore,
        benchmarkScore: resultB.scores.benchmarkScore,
        accessibilityPenalty: resultB.scores.accessibilityPenalty,
        issues: resultB.issues as any,
        suggestions: resultB.suggestions as any,
        copyRewrites: resultB.copyRewrites as any,
        lighthouseData: (resultB.lighthouseData || {}) as any,
        pa11yData: resultB.pa11yData as any,
        harData: resultB.harData as any,
        extendedMetrics: resultB.extendedMetrics as any,
        userId,
      },
    }),
  ])

  // Generate AI comparison summary
  let summary = ''
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Compare these two landing pages briefly (3-4 sentences):
Page A (${urlA}): Overall ${resultA.scores.overallScore}/100, Structure ${resultA.scores.structureScore}, Conversion ${resultA.scores.conversionScore}, Performance ${resultA.scores.performanceScore}, SEO ${resultA.scores.seoScore}
Page B (${urlB}): Overall ${resultB.scores.overallScore}/100, Structure ${resultB.scores.structureScore}, Conversion ${resultB.scores.conversionScore}, Performance ${resultB.scores.performanceScore}, SEO ${resultB.scores.seoScore}
Which is better and why?`,
      }],
    })
    summary = response.content[0].type === 'text' ? response.content[0].text : ''
  } catch { summary = 'Comparison summary unavailable.' }

  const comparison = await prisma.comparisonReport.create({
    data: { urlA, urlB, reportAId: reportA.id, reportBId: reportB.id, summary, userId },
  })

  return NextResponse.json({ comparisonId: comparison.id, reportAId: reportA.id, reportBId: reportB.id })
}
