import Anthropic from '@anthropic-ai/sdk'
import { DomData } from '../dom-extractor'
import { ScoringResult } from '../scoring'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
})

interface Suggestion {
  title: string
  impact: 'high' | 'medium' | 'low'
  fix: string
  dimension: string
}

export async function generateSuggestions(domData: DomData, scores: ScoringResult): Promise<Suggestion[]> {
  try {
    const prompt = `Analyze this landing page data and provide actionable optimization suggestions.

Page title: ${domData.title}
Headline: ${domData.heroText.headline}
Subheadline: ${domData.heroText.subheadline}
CTA text: ${domData.heroText.ctaText}
Page text (excerpt): ${domData.pageText.slice(0, 2000)}

Current scores:
- Structure: ${scores.structureScore}/100
- Conversion: ${scores.conversionScore}/100
- Performance: ${scores.performanceScore}/100
- SEO: ${scores.seoScore}/100

Top issues: ${scores.structureIssues.concat(scores.conversionIssues, scores.seoIssues).slice(0, 5).map(i => i.message).join('; ')}

Return ONLY a JSON array of 5-8 suggestions, prioritized by impact:
[{"title": "...", "impact": "high|medium|low", "fix": "specific actionable fix", "dimension": "structure|conversion|performance|seo|copy"}]`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }, { timeout: 30000 })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('AI suggestions failed:', err)
    return []
  }
}

export async function analyzeCopy(domData: DomData): Promise<{ score: number; feedback: string } | null> {
  try {
    const prompt = `Rate this landing page copy quality 0-100. Evaluate: clarity, persuasiveness, value proposition, CTA strength, grammar.

Headline: ${domData.heroText.headline}
Subheadline: ${domData.heroText.subheadline}
CTA: ${domData.heroText.ctaText}
Body (excerpt): ${domData.pageText.slice(0, 1500)}

Return ONLY JSON: {"score": <0-100>, "feedback": "<2-3 sentences>"}`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }, { timeout: 30000 })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('AI copy analysis failed:', err)
    return null
  }
}
