import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const report = await prisma.analysisReport.findUnique({ where: { id } })
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  const session = await getServerSession()
  const plan = (session?.user as any)?.plan || 'FREE'

  // Plan gating — FREE users get limited data
  const response: any = {
    id: report.id,
    url: report.url,
    overallScore: report.overallScore,
    letterGrade: report.letterGrade,
    structureScore: report.structureScore,
    designScore: report.designScore,
    conversionScore: report.conversionScore,
    performanceScore: report.performanceScore,
    seoScore: report.seoScore,
    benchmarkScore: report.benchmarkScore,
    accessibilityPenalty: report.accessibilityPenalty,
    issues: report.issues,
    createdAt: report.createdAt,
  }

  // PRO+ get suggestions and copy score
  if (plan !== 'FREE') {
    response.copyScore = report.copyScore
    response.suggestions = report.suggestions
    response.copyRewrites = report.copyRewrites
    response.harData = report.harData
    response.extendedMetrics = report.extendedMetrics
    response.frontendQualityIssues = report.frontendQualityIssues
  } else {
    response.suggestionsLocked = true
    response.copyRewritesLocked = true
    // Show first 2 suggestions as teaser
    const allSuggestions = report.suggestions as any[]
    response.suggestions = allSuggestions?.slice(0, 2) || []
    response.suggestionsTotal = allSuggestions?.length || 0
  }

  return NextResponse.json(response)
}
