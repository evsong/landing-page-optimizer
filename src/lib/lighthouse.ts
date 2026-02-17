import { Browser } from 'puppeteer-core'

interface LighthouseResult {
  categories: {
    performance: { score: number }
    accessibility: { score: number }
    'best-practices': { score: number }
    seo: { score: number }
  }
  audits: Record<string, any>
}

export async function runLighthouse(url: string, browser: Browser): Promise<LighthouseResult | null> {
  try {
    // Dynamic import to avoid bundling issues
    const lighthouse = (await import('lighthouse')).default
    const wsEndpoint = browser.wsEndpoint()
    const port = parseInt(new URL(wsEndpoint).port)

    const result = await lighthouse(url, {
      port,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: { disabled: true },
      throttling: { cpuSlowdownMultiplier: 1 },
    })

    if (!result?.lhr) return null

    return {
      categories: {
        performance: { score: (result.lhr.categories.performance?.score || 0) * 100 },
        accessibility: { score: (result.lhr.categories.accessibility?.score || 0) * 100 },
        'best-practices': { score: (result.lhr.categories['best-practices']?.score || 0) * 100 },
        seo: { score: (result.lhr.categories.seo?.score || 0) * 100 },
      },
      audits: result.lhr.audits,
    }
  } catch (err) {
    console.error('Lighthouse failed:', err)
    return null
  }
}
