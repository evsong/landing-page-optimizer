import { prisma } from './prisma'
import { Plan } from '@prisma/client'

type Feature = 'analyze' | 'compare' | 'pdf' | 'api' | 'whitelabel'

const PLAN_LIMITS: Record<Plan, { monthlyAnalyses: number; features: Feature[] }> = {
  FREE: { monthlyAnalyses: 3, features: ['analyze'] },
  PRO: { monthlyAnalyses: -1, features: ['analyze', 'pdf'] },
  AGENCY: { monthlyAnalyses: -1, features: ['analyze', 'compare', 'pdf', 'api', 'whitelabel'] },
}

export async function checkPlanAccess(userId: string, feature: Feature): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { allowed: false, reason: 'User not found' }

  // Reset monthly counter if needed
  const now = new Date()
  if (now > user.monthResetAt) {
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    await prisma.user.update({
      where: { id: userId },
      data: { analysisCount: 0, monthResetAt: nextReset },
    })
    user.analysisCount = 0
  }

  const limits = PLAN_LIMITS[user.plan]

  // Check feature access
  if (!limits.features.includes(feature)) {
    return { allowed: false, reason: `${feature} requires ${feature === 'compare' ? 'AGENCY' : 'PRO'} plan` }
  }

  // Check monthly limit for analyze
  if (feature === 'analyze' && limits.monthlyAnalyses > 0 && user.analysisCount >= limits.monthlyAnalyses) {
    return { allowed: false, reason: `Monthly limit reached (${limits.monthlyAnalyses} analyses). Upgrade to PRO for unlimited.` }
  }

  return { allowed: true }
}

export async function incrementAnalysisCount(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { analysisCount: { increment: 1 } },
  })
}
