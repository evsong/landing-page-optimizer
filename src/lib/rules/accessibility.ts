import { Pa11yResult } from '../pa11y'
import { Issue } from '../scoring'

export function scoreAccessibility(pa11yData: Pa11yResult | null): { penalty: number; issues: Issue[] } {
  if (!pa11yData) return { penalty: 0, issues: [] }

  const issues: Issue[] = []
  let errorCount = 0
  let warningCount = 0

  for (const issue of pa11yData.issues) {
    const severity = issue.type === 'error' ? 'high' : issue.type === 'warning' ? 'medium' : 'low'

    if (issue.type === 'error') errorCount++
    if (issue.type === 'warning') warningCount++

    issues.push({
      dimension: 'accessibility',
      severity,
      message: issue.message,
      code: issue.code,
      selector: issue.selector,
    })
  }

  // Penalty: -2 per error (max -10), -1 per warning (max -5)
  const errorPenalty = Math.min(10, errorCount * 2)
  const warningPenalty = Math.min(5, warningCount * 1)

  return { penalty: errorPenalty + warningPenalty, issues }
}
