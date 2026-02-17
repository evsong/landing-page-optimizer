import { UrlInput } from "@/components/UrlInput";
import { FAQ } from "@/components/FAQ";
import { BarChart3, Eye, FileText, Gauge, Layout, Search, Zap } from "lucide-react";
import Link from "next/link";

const dimensions = [
  { icon: <Layout className="w-5 h-5" />, title: "Structure", desc: "Hero, social proof, FAQ, pricing — are all key sections present?" },
  { icon: <Eye className="w-5 h-5" />, title: "Visual Design", desc: "AI vision analysis of color, typography, whitespace, and hierarchy." },
  { icon: <FileText className="w-5 h-5" />, title: "Copy Quality", desc: "Headline clarity, CTA strength, value proposition, and persuasiveness." },
  { icon: <Zap className="w-5 h-5" />, title: "Conversion", desc: "CTA placement, form friction, trust signals, and urgency elements." },
  { icon: <Gauge className="w-5 h-5" />, title: "Performance", desc: "Lighthouse + HAR analysis: load speed, bundle size, render-blocking." },
  { icon: <Search className="w-5 h-5" />, title: "SEO Basics", desc: "Title, meta, OG tags, heading hierarchy, alt texts, structured data." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Benchmark", desc: "How you compare against industry averages and top performers." },
];

const plans = [
  {
    name: "Free", price: "$0", period: "forever",
    features: ["3 analyses / month", "7-dimension score", "Top issues list", "Basic report"],
    cta: "Get Started", href: "/auth/signin", highlight: false,
  },
  {
    name: "Pro", price: "$5.99", period: "/month",
    features: ["Unlimited analyses", "AI suggestions", "Copy rewrites", "PDF export", "History & trends"],
    cta: "Start Free Trial", href: "/auth/signin", highlight: true,
  },
  {
    name: "Agency", price: "$49", period: "/month",
    features: ["Everything in Pro", "Competitor comparison", "White-label PDF reports", "API access", "Priority support"],
    cta: "Start Free Trial", href: "/auth/signin", highlight: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
          PageScore
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Pricing</Link>
          <Link href="/auth/signin" className="text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 mb-6 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          AI-Powered Landing Page Analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          How good is your<br />
          <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">landing page?</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
          Get a 7-dimension score with AI-powered suggestions in under 60 seconds. Find exactly where you&apos;re losing conversions.
        </p>
        <UrlInput />
        <p className="mt-4 text-xs text-zinc-600">No signup required for your first analysis</p>
      </section>

      {/* 7 Dimensions */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">7 dimensions. One score.</h2>
        <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
          We analyze your page from every angle that matters for conversion.
        </p>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dimensions.map((d, i) => (
            <div key={i} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="text-cyan-400 mb-3">{d.icon}</div>
              <h3 className="font-semibold mb-1">{d.title}</h3>
              <p className="text-sm text-zinc-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Paste any URL", desc: "We simulate a real user visit to capture load speed, design, and copy." },
            { step: "02", title: "Identify leaks", desc: "Find exactly where you're losing customers and revenue." },
            { step: "03", title: "Fix & scale", desc: "Get AI-rewritten copy and code snippets to boost conversion." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-mono text-cyan-400 mb-2">{s.step}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-zinc-400 text-center mb-12">Start free. Upgrade when you need more.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`p-6 rounded-xl border ${plan.highlight ? "border-cyan-500/50 bg-cyan-500/5" : "border-zinc-800 bg-zinc-900/50"}`}>
              <h3 className="font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-sm text-zinc-400 flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:opacity-90"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        <FAQ />
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-zinc-600">© 2026 PageScore. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-zinc-600">
            <Link href="#" className="hover:text-zinc-400">Privacy</Link>
            <Link href="#" className="hover:text-zinc-400">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
