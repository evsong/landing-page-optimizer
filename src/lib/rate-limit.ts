import { prisma } from './prisma'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  FREE: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10/hour
  PRO: { maxRequests: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  AGENCY: { maxRequests: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  anonymous: { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3/day
}

export async function checkRateLimit(
  key: string,
  plan: string = 'anonymous',
  endpoint: string = 'analyze'
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const config = RATE_LIMITS[plan] || RATE_LIMITS.anonymous
  const now = new Date()

  const existing = await prisma.rateLimit.findUnique({
    where: { key_endpoint: { key, endpoint } },
  })

  // No record or window expired → reset
  if (!existing || now.getTime() - existing.windowStart.getTime() > config.windowMs) {
    await prisma.rateLimit.upsert({
      where: { key_endpoint: { key, endpoint } },
      create: { key, endpoint, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now.getTime() + config.windowMs,
    }
  }

  // Within window, check limit
  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.windowStart.getTime() + config.windowMs,
    }
  }

  // Increment
  await prisma.rateLimit.update({
    where: { key_endpoint: { key, endpoint } },
    data: { count: { increment: 1 } },
  })

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count - 1,
    resetAt: existing.windowStart.getTime() + config.windowMs,
  }
}
