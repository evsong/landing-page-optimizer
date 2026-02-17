import { DomData } from '../dom-extractor'
import { Issue } from '../scoring'

export function scoreStructure(domData: DomData): { score: number; issues: Issue[] } {
  const issues: Issue[] = []
  const sections = domData.sections
  const checks = [
    { key: 'hasHero', label: 'Hero section (h1 + CTA)', weight: 20 },
    { key: 'hasSocialProof', label: 'Social proof', weight: 10 },
    { key: 'hasHowItWorks', label: 'How it works', weight: 10 },
    { key: 'hasFeatures', label: 'Features/Benefits', weight: 15 },
    { key: 'hasTestimonials', label: 'Testimonials', weight: 10 },
    { key: 'hasPricing', label: 'Pricing', weight: 10 },
    { key: 'hasFaq', label: 'FAQ', weight: 10 },
    { key: 'hasLeadForm', label: 'Lead capture form', weight: 10 },
    { key: 'hasFooter', label: 'Footer', weight: 5 },
  ]

  let score = 0
  for (const check of checks) {
    if (sections[check.key as keyof typeof sections]) {
      score += check.weight
    } else {
      issues.push({
        dimension: 'structure',
        severity: check.weight >= 15 ? 'high' : check.weight >= 10 ? 'medium' : 'low',
        message: `Missing: ${check.label}`,
      })
    }
  }

  return { score: Math.min(100, score), issues }
}
