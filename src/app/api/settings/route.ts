import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { whitelabelName, whitelabelLogo, whitelabelColor } = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: { whitelabelName, whitelabelLogo, whitelabelColor },
  })

  return NextResponse.json({ ok: true })
}
