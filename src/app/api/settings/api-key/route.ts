import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST() {
  const session = await getServerSession()
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } })
  if (user?.plan !== 'AGENCY') return NextResponse.json({ error: 'Agency plan required' }, { status: 403 })

  const apiKey = `ps_${crypto.randomBytes(24).toString('hex')}`
  await prisma.user.update({ where: { id: userId }, data: { apiKey } })

  return NextResponse.json({ apiKey })
}
