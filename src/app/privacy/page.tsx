export default function PrivacyPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-20 text-[var(--text-2)]">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="mb-4 text-sm text-[var(--text-3)]">Last updated: February 20, 2026</p>

      <section className="space-y-4 text-[0.9rem] leading-relaxed">
        <h2 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h2>
        <p>When you use PageScore, we collect:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>URLs you submit for analysis</li>
          <li>Account information (email address) when you sign in</li>
          <li>Usage data such as analysis history and feature usage</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8">2. How We Use Your Data</h2>
        <p>We use collected data to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Perform landing page analysis and generate reports</li>
          <li>Improve our scoring algorithms and AI suggestions</li>
          <li>Manage your account and subscription</li>
          <li>Send transactional emails (e.g., magic link sign-in)</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8">3. Data Storage & Security</h2>
        <p>Your data is stored securely on cloud infrastructure (Vercel, Neon PostgreSQL). We use encryption in transit (HTTPS) and follow industry-standard security practices. Screenshots captured during analysis are stored temporarily and deleted after report generation.</p>

        <h2 className="text-xl font-semibold text-white mt-8">4. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Anthropic Claude API — AI-powered analysis and suggestions</li>
          <li>Google Lighthouse — performance and SEO auditing</li>
          <li>Creem — payment processing</li>
          <li>Resend — transactional email delivery</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8">5. Your Rights</h2>
        <p>You may request deletion of your account and associated data at any time by contacting us at support@landingpageoptimizer.online.</p>

        <h2 className="text-xl font-semibold text-white mt-8">6. Contact</h2>
        <p>For privacy-related inquiries, email us at <a href="mailto:support@landingpageoptimizer.online" className="text-[var(--accent)] hover:underline">support@landingpageoptimizer.online</a>.</p>
      </section>
    </main>
  );
}
