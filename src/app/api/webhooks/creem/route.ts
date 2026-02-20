import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Plan } from '@prisma/client'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('creem-signature') || ''

  // Verify webhook signature
  const expected = crypto
    .createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (sig !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  switch (event.event_type) {
    case 'checkout.completed': {
      const userId = event.data?.metadata?.userId
      const plan = event.data?.metadata?.plan as Plan
      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeCustomerId: event.data?.customer?.id || null,
            stripeSubscriptionId: event.data?.subscription?.id || null,
          },
        })
      }
      break
    }
    case 'subscription.canceled': {
      const customerId = event.data?.customer?.id
      if (customerId) {
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'FREE', stripeSubscriptionId: null },
          })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
