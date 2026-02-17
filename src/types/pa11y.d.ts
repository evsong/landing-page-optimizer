declare module 'pa11y' {
  interface Pa11yOptions {
    standard?: string
    runner?: string[]
    runners?: string[]
    timeout?: number
    wait?: number
    chromeLaunchConfig?: Record<string, any>
  }
  interface Pa11yIssue {
    code: string
    type: string
    message: string
    selector: string
    context: string
    runner: string
  }
  interface Pa11yResults {
    issues: Pa11yIssue[]
    documentTitle: string
    pageUrl: string
  }
  function pa11y(url: string, options?: Pa11yOptions): Promise<Pa11yResults>
  export default pa11y
}
