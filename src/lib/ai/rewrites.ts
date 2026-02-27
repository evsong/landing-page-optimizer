import Anthropic from '@anthropic-ai/sdk'
import { DomData } from '../dom-extractor'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
})

interface CopyRewrite {
  element: string
  original: string
  alternatives: string[]
}

export async function generateRewrites(domData: DomData): Promise<CopyRewrite[]> {
  try {
    const prompt = `Rewrite the following landing page copy elements. For each, provide 3 improved alternatives that are more compelling and conversion-focused.

Headline: "${domData.heroText.headline}"
Subheadline: "${domData.heroText.subheadline}"
CTA button: "${domData.heroText.ctaText}"

Return ONLY a JSON array:
[{"element": "headline|subheadline|cta", "original": "...", "alternatives": ["alt1", "alt2", "alt3"]}]`

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
    console.error('AI rewrites failed:', err)
    return []
  }
}
