import puppeteer, { Browser, Page } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { runLighthouse } from './lighthouse'
import { runPa11y } from './pa11y'
import { extractDomData, DomData } from './dom-extractor'
import { captureHar, HarData } from './har-analyzer'
import { collectExtendedMetrics, ExtendedMetrics } from './extended-metrics'
import { computeScores, recalculateOverall, ScoringResult } from './scoring'
import { analyzeDesign } from './ai/vision'
import { generateSuggestions, analyzeCopy } from './ai/suggestions'
import { generateRewrites } from './ai/rewrites'

export interface AnalysisResult {
  url: string
  finalUrl: string
  scores: ScoringResult
  issues: Array<{ dimension: string; severity: string; message: string; code?: string; selector?: string }>
  suggestions: Array<{ title: string; impact: string; fix: string; dimension: string }>
  copyRewrites: Array<{ element: string; original: string; alternatives: string[] }> | null
  lighthouseData: any
  pa11yData: any
  harData: HarData | null
  extendedMetrics: ExtendedMetrics | null
  screenshotDesktop: Buffer | null
  screenshotMobile: Buffer | null
}

async function launchBrowser(): Promise<Browser> {
  const isLocal = process.env.NODE_ENV === 'development'
  return puppeteer.launch({
    args: isLocal ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
    defaultViewport: { width: 1440, height: 900 },
    executablePath: isLocal
      ? process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : await chromium.executablePath(),
    headless: true,
  })
}

export async function analyzeUrl(
  url: string,
  onProgress?: (step: string, progress: number) => void,
): Promise<AnalysisResult> {
  let browser: Browser | null = null
  const report = (step: string, progress: number) => onProgress?.(step, progress)

  try {
    report('launching', 5)
    browser = await launchBrowser()
    const page = await browser.newPage()

    // Step 1: Load page with HAR capture
    report('loading', 15)
    const harPromise = captureHar(page)
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch (navErr: any) {
      // If navigation times out, continue with whatever loaded
      if (!navErr.message?.includes('timeout')) throw navErr
      console.warn('Navigation timeout, continuing with partial load')
    }
    const finalUrl = page.url()

    // Step 2: Screenshots (desktop + mobile)
    report('screenshots', 30)
    const screenshotDesktop = await page.screenshot({ fullPage: true, type: 'png' }) as Buffer

    await page.setViewport({ width: 375, height: 812 })
    const screenshotMobile = await page.screenshot({ fullPage: true, type: 'png' }) as Buffer
    await page.setViewport({ width: 1440, height: 900 })

    // Step 3: DOM extraction + extended metrics (parallel)
    const [domData, extendedMetrics] = await Promise.all([
      extractDomData(page),
      collectExtendedMetrics(page),
    ])

    // Step 4: Lighthouse + Pa11y (parallel)
    report('auditing', 50)
    const [lighthouseResult, pa11yResult] = await Promise.allSettled([
      runLighthouse(finalUrl, browser),
      runPa11y(finalUrl),
    ])

    const lighthouseData = lighthouseResult.status === 'fulfilled' ? lighthouseResult.value : null
    const pa11yData = pa11yResult.status === 'fulfilled' ? pa11yResult.value : null

    // Step 5: HAR analysis
    const harData = await harPromise

    // Step 6: Scoring
    report('scoring', 65)
    const scores = computeScores(domData, lighthouseData, pa11yData, harData, extendedMetrics)

    // Step 7-8: AI analysis (design + suggestions in parallel, then copy sequentially to avoid proxy rate limits)
    report('ai_analysis', 80)
    const [designResult, suggestionsResult] = await Promise.allSettled([
      analyzeDesign(screenshotDesktop),
      generateSuggestions(domData, scores),
    ])

    const designScore = designResult.status === 'fulfilled' ? designResult.value : null
    if (designScore) {
      scores.designScore = designScore.score
    }

    const suggestions = suggestionsResult.status === 'fulfilled' ? suggestionsResult.value : []

    // Run copy analysis after suggestions to avoid concurrent Anthropic proxy requests
    try {
      const copyAnalysis = await analyzeCopy(domData)
      scores.copyScore = copyAnalysis.score
    } catch (err: any) {
      console.error('Copy analysis failed in analyzer:', err?.message || err)
      ;(scores as any)._copyError = String(err?.message || err).slice(0, 500)
    }

    recalculateOverall(scores)

    // Copy rewrites for low copy scores
    let copyRewrites = null
    if (scores.copyScore !== null && scores.copyScore < 70) {
      try {
        copyRewrites = await generateRewrites(domData)
      } catch { /* non-critical */ }
    }

    // Collect all issues
    report('finalizing', 95)
    const issues = [
      ...scores.structureIssues,
      ...scores.conversionIssues,
      ...scores.performanceIssues,
      ...scores.seoIssues,
      ...scores.accessibilityIssues,
      ...scores.frontendQualityIssues,
    ]

    return {
      url,
      finalUrl,
      scores,
      issues,
      suggestions,
      copyRewrites,
      lighthouseData,
      pa11yData,
      harData,
      extendedMetrics,
      screenshotDesktop,
      screenshotMobile,
    }
  } finally {
    if (browser) await browser.close()
  }
}
