import { DomData } from '../dom-extractor'
import { Issue } from '../scoring'

export function scoreConversion(domData: DomData): { score: number; issues: Issue[] } {
  const issues: Issue[] = []
  let score = 100

  // CTA above the fold
  const ctaAboveFold = domData.buttons.some(b => b.isAboveFold && b.text.length > 0)
  if (!ctaAboveFold) {
    score -= 20
    issues.push({ dimension: 'conversion', severity: 'high', message: 'No CTA button above the fold' })
  }

  // Number of CTAs (1-3 is ideal)
  const ctaCount = domData.buttons.filter(b => b.text.length > 0).length
  if (ctaCount === 0) {
    score -= 25
    issues.push({ dimension: 'conversion', severity: 'high', message: 'No CTA buttons found on page' })
  } else if (ctaCount > 5) {
    score -= 5
    issues.push({ dimension: 'conversion', severity: 'low', message: `Too many CTAs (${ctaCount}) may dilute focus` })
  }

  // Form field count (fewer is better)
  for (const form of domData.forms) {
    if (form.fields > 5) {
      score -= 10
      issues.push({ dimension: 'conversion', severity: 'medium', message: `Form has ${form.fields} fields — consider reducing to 3-4` })
    }
  }

  // Trust signals
  const pageText = domData.pageText.toLowerCase()
  const trustSignals = ['guarantee', 'secure', 'trusted', 'certified', 'ssl', 'privacy', 'refund', 'money back']
  const hasTrust = trustSignals.some(s => pageText.includes(s))
  if (!hasTrust) {
    score -= 10
    issues.push({ dimension: 'conversion', severity: 'medium', message: 'No trust signals found (guarantees, security badges, etc.)' })
  }

  // Social proof strength
  if (!domData.sections.hasSocialProof && !domData.sections.hasTestimonials) {
    score -= 10
    issues.push({ dimension: 'conversion', severity: 'medium', message: 'No social proof or testimonials' })
  }

  // Urgency elements
  const urgencyWords = ['limited', 'today', 'now', 'hurry', 'last chance', 'exclusive', 'only']
  const hasUrgency = urgencyWords.some(w => pageText.includes(w))
  if (!hasUrgency) {
    score -= 5
    issues.push({ dimension: 'conversion', severity: 'low', message: 'No urgency elements detected' })
  }

  // Hero headline clarity
  if (!domData.heroText.headline || domData.heroText.headline.length < 5) {
    score -= 15
    issues.push({ dimension: 'conversion', severity: 'high', message: 'Missing or too short hero headline' })
  }

  return { score: Math.max(0, score), issues }
}
