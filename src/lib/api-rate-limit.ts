import { prisma } from './prisma'

export async function checkApiRateLimit(key: string, limit = 10, windowMs = 60000): Promise<boolean> {
  const now = new Date()
  const endpoint = 'api-v1'

  const existing = await prisma.rateLimit.findUnique({
    where: { key_endpoint: { key, endpoint } },
  })

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.rateLimit.upsert({
      where: { key_endpoint: { key, endpoint } },
      create: { key, endpoint, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    })
    return true
  }

  if (existing.count >= limit) return false

  await prisma.rateLimit.update({
    where: { key_endpoint: { key, endpoint } },
    data: { count: { increment: 1 } },
  })
  return true
}
