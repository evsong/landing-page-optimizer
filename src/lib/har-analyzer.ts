import { Page } from 'puppeteer-core'

export interface HarEntry {
  url: string
  type: string
  transferSize: number
  contentSize: number
  mimeType: string
  isThirdParty: boolean
  isRenderBlocking: boolean
}

export interface HarData {
  totalRequests: number
  totalTransferSize: number
  requestsByType: Record<string, number>
  transferByType: Record<string, number>
  largestResources: Array<{ url: string; size: number; type: string }>
  thirdPartyCount: number
  thirdPartyPercent: number
  renderBlockingCount: number
  unusedJsPercent: number | null
  hasModernImages: boolean
  entries: HarEntry[]
}

export async function captureHar(page: Page): Promise<HarData | null> {
  try {
    const client = await page.createCDPSession()
    const entries: HarEntry[] = []
    const responseData = new Map<string, { size: number; mimeType: string }>()

    await client.send('Network.enable')

    client.on('Network.responseReceived', (event: any) => {
      const { response, type } = event
      responseData.set(event.requestId, {
        size: response.encodedDataLength || 0,
        mimeType: response.mimeType || '',
      })
    })

    client.on('Network.loadingFinished', (event: any) => {
      const data = responseData.get(event.requestId)
      if (data) {
        data.size = event.encodedDataLength || data.size
      }
    })

    // Wait for page to finish loading (caller handles navigation)
    // We collect data passively during page load
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get all resource entries from Performance API
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((r: any) => ({
        url: r.name,
        transferSize: r.transferSize || 0,
        type: r.initiatorType || 'other',
      }))
    })

    const pageUrl = new URL(page.url())

    for (const r of resources) {
      let resourceUrl: URL
      try { resourceUrl = new URL(r.url) } catch { continue }

      const mimeType = guessMimeType(r.url)
      const type = categorizeType(r.type, mimeType)

      entries.push({
        url: r.url,
        type,
        transferSize: r.transferSize,
        contentSize: r.transferSize,
        mimeType,
        isThirdParty: resourceUrl.hostname !== pageUrl.hostname,
        isRenderBlocking: type === 'stylesheet' || (type === 'script' && !r.url.includes('async') && !r.url.includes('defer')),
      })
    }

    // Unused JS estimate via Coverage API
    let unusedJsPercent: number | null = null
    try {
      await client.send('Profiler.enable')
      await client.send('Profiler.startPreciseCoverage', { callCount: false, detailed: false })
      await new Promise(resolve => setTimeout(resolve, 500))
      const coverage = await client.send('Profiler.takePreciseCoverage')
      await client.send('Profiler.stopPreciseCoverage')

      let totalBytes = 0
      let usedBytes = 0
      for (const script of coverage.result) {
        for (const fn of script.functions) {
          for (const range of fn.ranges) {
            totalBytes += range.endOffset - range.startOffset
            if (range.count > 0) usedBytes += range.endOffset - range.startOffset
          }
        }
      }
      if (totalBytes > 0) unusedJsPercent = Math.round(((totalBytes - usedBytes) / totalBytes) * 100)
    } catch { /* Coverage API may not be available */ }

    await client.detach()

    // Compute aggregates
    const requestsByType: Record<string, number> = {}
    const transferByType: Record<string, number> = {}
    let thirdPartyCount = 0
    let renderBlockingCount = 0
    let totalTransferSize = 0

    for (const e of entries) {
      requestsByType[e.type] = (requestsByType[e.type] || 0) + 1
      transferByType[e.type] = (transferByType[e.type] || 0) + e.transferSize
      totalTransferSize += e.transferSize
      if (e.isThirdParty) thirdPartyCount++
      if (e.isRenderBlocking) renderBlockingCount++
    }

    const largestResources = [...entries]
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 5)
      .map(e => ({ url: e.url, size: e.transferSize, type: e.type }))

    const hasModernImages = entries
      .filter(e => e.type === 'image')
      .some(e => e.mimeType.includes('webp') || e.mimeType.includes('avif') || e.url.match(/\.(webp|avif)$/i))

    return {
      totalRequests: entries.length,
      totalTransferSize,
      requestsByType,
      transferByType,
      largestResources,
      thirdPartyCount,
      thirdPartyPercent: entries.length > 0 ? Math.round((thirdPartyCount / entries.length) * 100) : 0,
      renderBlockingCount,
      unusedJsPercent,
      hasModernImages,
      entries,
    }
  } catch (err) {
    console.error('HAR capture failed:', err)
    return null
  }
}

function guessMimeType(url: string): string {
  if (url.match(/\.(js|mjs)(\?|$)/i)) return 'application/javascript'
  if (url.match(/\.css(\?|$)/i)) return 'text/css'
  if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)(\?|$)/i)) return 'image/' + url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)/i)?.[1]
  if (url.match(/\.(woff2?|ttf|otf|eot)(\?|$)/i)) return 'font/' + url.match(/\.(woff2?|ttf|otf|eot)/i)?.[1]
  return 'other'
}

function categorizeType(initiatorType: string, mimeType: string): string {
  if (initiatorType === 'script' || mimeType.includes('javascript')) return 'script'
  if (initiatorType === 'css' || mimeType.includes('css')) return 'stylesheet'
  if (mimeType.includes('image')) return 'image'
  if (mimeType.includes('font')) return 'font'
  if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') return 'xhr'
  return 'other'
}
