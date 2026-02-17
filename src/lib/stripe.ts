import Stripe from 'stripe'

let _stripe: Stripe | null = null
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })
  }
  return _stripe
}

const PRICE_IDS: Record<string, string> = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || '',
  AGENCY: process.env.STRIPE_AGENCY_PRICE_ID || '',
}

export async function createCheckoutSession(userId: string, plan: 'PRO' | 'AGENCY', customerId?: string) {
  const session = await getStripe().checkout.sessions.create({
    customer: customerId || undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=${plan}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    metadata: { userId, plan },
  })
  return session
}

export async function createBillingPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })
  return session
}
