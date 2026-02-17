import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/stripe'
import { Plan } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { plan } = await req.json()
  if (!['PRO', 'AGENCY'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const checkoutSession = await createCheckoutSession(userId, plan as 'PRO' | 'AGENCY', user.stripeCustomerId || undefined)

  return NextResponse.json({ url: checkoutSession.url })
}
