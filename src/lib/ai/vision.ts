import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
})

interface DesignAnalysis {
  score: number
  colorHarmony: number
  typography: number
  whitespace: number
  visualHierarchy: number
  aesthetics: number
  feedback: string
}

export async function analyzeDesign(screenshot: Buffer): Promise<DesignAnalysis | null> {
  try {
    const base64 = screenshot.toString('base64')

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: base64 },
          },
          {
            type: 'text',
            text: `Analyze this landing page screenshot for visual design quality. Rate each dimension 0-100 and provide brief feedback.

Return ONLY valid JSON:
{
  "colorHarmony": <0-100>,
  "typography": <0-100>,
  "whitespace": <0-100>,
  "visualHierarchy": <0-100>,
  "aesthetics": <0-100>,
  "feedback": "<2-3 sentence summary>"
}`,
          },
        ],
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const data = JSON.parse(jsonMatch[0])
    const score = Math.round(
      (data.colorHarmony + data.typography + data.whitespace + data.visualHierarchy + data.aesthetics) / 5
    )

    return { score, ...data }
  } catch (err) {
    console.error('AI Vision failed:', err)
    return null
  }
}
