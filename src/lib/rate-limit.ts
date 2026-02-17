const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  FREE: { maxRequests: 3, windowMs: 30 * 24 * 60 * 60 * 1000 }, // 3/month
  PRO: { maxRequests: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  AGENCY: { maxRequests: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  anonymous: { maxRequests: 1, windowMs: 24 * 60 * 60 * 1000 }, // 1/day
}

export function checkRateLimit(key: string, plan: string = 'anonymous'): { allowed: boolean; remaining: number; resetAt: number } {
  const config = RATE_LIMITS[plan] || RATE_LIMITS.anonymous
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}
