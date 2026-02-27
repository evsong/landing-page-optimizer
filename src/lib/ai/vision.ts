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

    const response = await fetch(process.env.ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.ZHIPU_VISION_MODEL || 'glm-4.6v',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${base64}` },
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
      }),
    })

    if (!response.ok) {
      console.error('ZhipuAI Vision API error:', response.status, await response.text().catch(() => ''))
      return null
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])
    const score = Math.round(
      (parsed.colorHarmony + parsed.typography + parsed.whitespace + parsed.visualHierarchy + parsed.aesthetics) / 5
    )

    return { score, ...parsed }
  } catch (err) {
    console.error('AI Vision failed:', err)
    return null
  }
}
