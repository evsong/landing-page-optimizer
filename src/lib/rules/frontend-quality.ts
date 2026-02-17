import { HarData } from '../har-analyzer'
import { ExtendedMetrics } from '../extended-metrics'
import { Issue } from '../scoring'

export function scoreFrontendQuality(harData: HarData | null, metrics: ExtendedMetrics | null): { issues: Issue[] } {
  const issues: Issue[] = []

  if (metrics) {
    // CSS complexity
    if (metrics.css.totalRules > 1000) {
      issues.push({ dimension: 'structure', severity: 'medium', message: `Excessive CSS rules: ${metrics.css.totalRules} (threshold: 1000)` })
    }
    if (metrics.css.importantCount > 20) {
      issues.push({ dimension: 'structure', severity: 'medium', message: `Excessive !important usage: ${metrics.css.importantCount} (threshold: 20)` })
    }
    if (metrics.css.inlineStyleCount > 50) {
      issues.push({ dimension: 'structure', severity: 'medium', message: `High inline style count: ${metrics.css.inlineStyleCount} (threshold: 50)` })
    }
    if (metrics.domMaxDepth > 15) {
      issues.push({ dimension: 'structure', severity: 'medium', message: `Excessive DOM depth: ${metrics.domMaxDepth} levels (threshold: 15)` })
    }

    // JS health
    if (metrics.eventListenerCount > 200) {
      issues.push({ dimension: 'performance', severity: 'medium', message: `High event listener count: ${metrics.eventListenerCount} (threshold: 200)` })
    }
  }

  if (harData) {
    const jsSize = harData.transferByType['script'] || 0
    if (jsSize > 500 * 1024) {
      issues.push({ dimension: 'performance', severity: 'medium', message: `Excessive JS transfer: ${(jsSize / 1024).toFixed(0)}KB (threshold: 500KB)` })
    }
    if (harData.unusedJsPercent !== null && harData.unusedJsPercent > 40) {
      issues.push({ dimension: 'performance', severity: 'medium', message: `${harData.unusedJsPercent}% unused JavaScript (threshold: 40%)` })
    }
  }

  return { issues }
}
