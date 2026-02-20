import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-auth'
import { checkApiRateLimit } from '@/lib/api-rate-limit'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user || user.plan !== 'AGENCY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkApiRateLimit(user.id)) {
    return NextResponse.json({ error: 'Rate limit exceeded (10/min)' }, { status: 429 })
  }

  const reports = await prisma.analysisReport.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      url: true,
      overallScore: true,
      letterGrade: true,
      structureScore: true,
      designScore: true,
      copyScore: true,
      conversionScore: true,
      performanceScore: true,
      seoScore: true,
      benchmarkScore: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ reports })
}
