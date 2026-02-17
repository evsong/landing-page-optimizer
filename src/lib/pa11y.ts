export interface Pa11yIssue {
  code: string
  type: 'error' | 'warning' | 'notice'
  message: string
  selector: string
  context: string
}

export interface Pa11yResult {
  issues: Pa11yIssue[]
  documentTitle: string
}

export async function runPa11y(url: string): Promise<Pa11yResult | null> {
  try {
    const pa11y = (await import('pa11y')).default

    const result = await pa11y(url, {
      standard: 'WCAG2AA',
      runners: ['axe'],
      timeout: 20000,
      wait: 2000,
      chromeLaunchConfig: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    })

    return {
      issues: (result.issues || []).map((issue: any) => ({
        code: issue.code || '',
        type: issue.type || 'notice',
        message: issue.message || '',
        selector: issue.selector || '',
        context: issue.context || '',
      })),
      documentTitle: result.documentTitle || '',
    }
  } catch (err) {
    console.error('Pa11y failed:', err)
    return null
  }
}
