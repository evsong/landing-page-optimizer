import { DomData } from '../dom-extractor'
import { Issue } from '../scoring'

export function scoreSeo(domData: DomData, lighthouseData: any): { score: number; issues: Issue[] } {
  const issues: Issue[] = []
  let score = lighthouseData?.categories?.seo?.score ?? 50

  // Title tag
  if (!domData.title) {
    score -= 10
    issues.push({ dimension: 'seo', severity: 'high', message: 'Missing title tag' })
  } else if (domData.title.length < 30 || domData.title.length > 70) {
    score -= 3
    issues.push({ dimension: 'seo', severity: 'low', message: `Title length ${domData.title.length} chars (ideal: 50-60)` })
  }

  // Meta description
  if (!domData.metaDescription) {
    score -= 8
    issues.push({ dimension: 'seo', severity: 'high', message: 'Missing meta description' })
  } else if (domData.metaDescription.length < 120 || domData.metaDescription.length > 170) {
    score -= 3
    issues.push({ dimension: 'seo', severity: 'low', message: `Meta description length ${domData.metaDescription.length} chars (ideal: 150-160)` })
  }

  // OG tags
  const requiredOg = ['title', 'description', 'image']
  for (const tag of requiredOg) {
    if (!domData.ogTags[tag]) {
      score -= 3
      issues.push({ dimension: 'seo', severity: 'medium', message: `Missing og:${tag} tag` })
    }
  }

  // Heading hierarchy
  const h1s = domData.headings.filter(h => h.level === 1)
  if (h1s.length === 0) {
    score -= 8
    issues.push({ dimension: 'seo', severity: 'high', message: 'No h1 tag found' })
  } else if (h1s.length > 1) {
    score -= 3
    issues.push({ dimension: 'seo', severity: 'medium', message: `Multiple h1 tags (${h1s.length}) — use only one` })
  }

  // Image alt texts
  const imagesWithoutAlt = domData.images.filter(img => !img.hasAlt)
  if (imagesWithoutAlt.length > 0) {
    const penalty = Math.min(5, imagesWithoutAlt.length)
    score -= penalty
    issues.push({ dimension: 'seo', severity: 'medium', message: `${imagesWithoutAlt.length} images missing alt text` })
  }

  // Canonical URL
  if (!domData.canonicalUrl) {
    score -= 3
    issues.push({ dimension: 'seo', severity: 'low', message: 'No canonical URL specified' })
  }

  // Structured data
  if (domData.jsonLd.length === 0) {
    score -= 3
    issues.push({ dimension: 'seo', severity: 'low', message: 'No structured data (JSON-LD) found' })
  }

  return { score: Math.max(0, Math.min(100, score)), issues }
}
