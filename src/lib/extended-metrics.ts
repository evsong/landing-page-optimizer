import { Page } from 'puppeteer-core'

export interface ExtendedMetrics {
  domNodeCount: number
  domMaxDepth: number
  eventListenerCount: number
  longTaskCount: number
  resourceEntryCount: number
  totalResourceDuration: number
  css: {
    stylesheetCount: number
    totalRules: number
    importantCount: number
    inlineStyleCount: number
  }
}

export async function collectExtendedMetrics(page: Page): Promise<ExtendedMetrics | null> {
  try {
    return await page.evaluate(() => {
      // DOM metrics
      const allElements = document.querySelectorAll('*')
      const domNodeCount = allElements.length

      // DOM max depth
      let domMaxDepth = 0
      function getDepth(el: Element, depth: number) {
        if (depth > domMaxDepth) domMaxDepth = depth
        for (const child of el.children) {
          getDepth(child, depth + 1)
        }
      }
      getDepth(document.documentElement, 0)

      // Event listener count (approximate via getEventListeners if available, otherwise count common attributes)
      let eventListenerCount = 0
      const eventAttrs = ['onclick', 'onchange', 'onsubmit', 'onmouseover', 'onkeydown', 'onkeyup', 'onfocus', 'onblur', 'onscroll', 'onload']
      allElements.forEach(el => {
        eventAttrs.forEach(attr => {
          if (el.hasAttribute(attr)) eventListenerCount++
        })
      })

      // Resource timing
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const resourceEntryCount = resources.length
      const totalResourceDuration = resources.reduce((sum, r) => sum + r.duration, 0)

      // Long tasks (approximate — check if PerformanceObserver captured any)
      let longTaskCount = 0
      try {
        const entries = performance.getEntriesByType('longtask')
        longTaskCount = entries.length
      } catch {
        // longtask not supported in all environments
      }

      // CSS complexity
      let totalRules = 0
      let importantCount = 0
      const stylesheetCount = document.styleSheets.length
      const inlineStyleCount = document.querySelectorAll('[style]').length

      try {
        for (const sheet of document.styleSheets) {
          try {
            const rules = sheet.cssRules || sheet.rules
            totalRules += rules.length
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule) {
                const cssText = rule.cssText
                const matches = cssText.match(/!important/g)
                if (matches) importantCount += matches.length
              }
            }
          } catch {
            // Cross-origin stylesheets can't be read
          }
        }
      } catch {}

      return {
        domNodeCount,
        domMaxDepth,
        eventListenerCount,
        longTaskCount,
        resourceEntryCount,
        totalResourceDuration,
        css: {
          stylesheetCount,
          totalRules,
          importantCount,
          inlineStyleCount,
        },
      }
    })
  } catch (err) {
    console.error('Extended metrics failed:', err)
    return null
  }
}
