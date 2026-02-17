import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const userId = (session?.user as any)?.id
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  const reports = await prisma.analysisReport.findMany({
    where: { userId, url },
    select: { overallScore: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })

  const trend = reports.map(r => ({
    date: r.createdAt.toISOString().split('T')[0],
    score: r.overallScore,
  }))

  return NextResponse.json({ trend })
}
