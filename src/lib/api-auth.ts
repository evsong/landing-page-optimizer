import { prisma } from '@/lib/prisma'

export async function authenticateApiKey(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null
  const key = authHeader.slice(7)
  if (!key) return null
  return prisma.user.findUnique({ where: { apiKey: key }, select: { id: true, plan: true } })
}
