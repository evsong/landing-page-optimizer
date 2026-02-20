export default function TermsPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-20 text-[var(--text-2)]">
      <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="mb-4 text-sm text-[var(--text-3)]">Last updated: February 20, 2026</p>

      <section className="space-y-4 text-[0.9rem] leading-relaxed">
        <h2 className="text-xl font-semibold text-white mt-8">1. Service Description</h2>
        <p>PageScore is an AI-powered landing page analysis tool that evaluates websites across multiple dimensions including structure, performance, SEO, accessibility, copy quality, conversion optimization, and design.</p>

        <h2 className="text-xl font-semibold text-white mt-8">2. Acceptable Use</h2>
        <p>You agree to only submit URLs that you own or have permission to analyze. You may not use PageScore to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Perform unauthorized security testing</li>
          <li>Overload or disrupt target websites</li>
          <li>Resell analysis data without an Agency plan</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8">3. Subscriptions & Billing</h2>
        <p>Paid plans are billed monthly through our payment processor (Creem). You may cancel at any time; access continues until the end of the billing period. Refunds are available within 7 days of purchase if no analyses have been run.</p>

        <h2 className="text-xl font-semibold text-white mt-8">4. Disclaimer</h2>
        <p>Analysis results and AI-generated suggestions are provided as-is for informational purposes. We do not guarantee specific outcomes from implementing our recommendations.</p>

        <h2 className="text-xl font-semibold text-white mt-8">5. Limitation of Liability</h2>
        <p>PageScore shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.</p>

        <h2 className="text-xl font-semibold text-white mt-8">6. Contact</h2>
        <p>Questions about these terms? Email <a href="mailto:support@landingpageoptimizer.online" className="text-[var(--accent)] hover:underline">support@landingpageoptimizer.online</a>.</p>
      </section>
    </main>
  );
}
