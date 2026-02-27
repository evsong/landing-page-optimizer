import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPlanAccess } from '@/lib/plan-gating'
import ReactPDF from '@react-pdf/renderer'
import { ReportPdf } from '@/lib/pdf-template'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkPlanAccess(userId, 'pdf')
  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 })
  }

  const { id } = await params
  const report = await prisma.analysisReport.findUnique({ where: { id } })
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, whitelabelLogo: true, whitelabelColor: true, whitelabelName: true },
  })

  const stream = await ReactPDF.renderToStream(
    ReportPdf({
      report,
      brandName: user?.whitelabelName || 'PageScore',
      brandColor: user?.whitelabelColor || '#0ea5e9',
    })
  )

  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  const buffer = Buffer.concat(chunks)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pagescore-${report.letterGrade}-${report.overallScore}.pdf"`,
    },
  })
}
