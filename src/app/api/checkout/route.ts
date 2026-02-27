import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Creem } from 'creem'

const creem = new Creem({ apiKey: process.env.CREEM_API_KEY! })

const PRODUCT_IDS: Record<string, string> = {
  PRO: process.env.CREEM_PRO_PRODUCT_ID || '',
  AGENCY: process.env.CREEM_AGENCY_PRODUCT_ID || '',
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
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

  const checkout = await creem.checkouts.create({
    productId: PRODUCT_IDS[plan],
    successUrl: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=${plan}`,
    metadata: { userId, plan },
    customer: user.email ? { email: user.email } : undefined,
  })

  return NextResponse.json({ url: checkout.checkoutUrl })
}
