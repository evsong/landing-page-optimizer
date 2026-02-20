"use client";

import { UrlInput } from "@/components/UrlInput";
import { FAQ } from "@/components/FAQ";
import { Navbar } from "@/components/Navbar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";

const dims = [
  { name: "Structure", desc: "Hero, CTA, social proof, FAQ completeness", icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></> },
  { name: "Design", desc: "Visual hierarchy, color harmony, spacing", icon: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></> },
  { name: "Copy", desc: "Headline clarity, value prop, CTA text", icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></> },
  { name: "Conversion", desc: "CTA placement, form friction, trust signals", icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></> },
  { name: "Performance", desc: "Core Web Vitals, load speed, TBT", icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></> },
  { name: "SEO", desc: "Meta tags, headings, alt text, schema", icon: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></> },
  { name: "Benchmark", desc: "Industry comparison, percentile rank", icon: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></> },
];

const steps = [
  { num: "01_ANALYZE", title: "Paste any URL", desc: "We simulate a real user visit to capture load speed, design, and copy." },
  { num: "02_DIAGNOSE", title: "Identify Leaks", desc: "Find exactly where you're losing customers (and revenue)." },
  { num: "03_OPTIMIZE", title: "Fix & Scale", desc: "Get AI-rewritten copy and code snippets to boost conversion." },
];

const plans = [
  { name: "Free", price: "$0", period: "/mo", desc: "Try it out — 3 analyses per month.", features: ["3 analyses / month", "7-dimension scoring", "Basic issue summary", "Score history (last 3)"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$5.99", period: "/mo", desc: "Unlimited analyses with AI suggestions.", features: ["Unlimited analyses", "AI actionable suggestions", "Copy rewrite alternatives", "Full history & trends", "Priority support"], cta: "Upgrade to Pro", popular: true },
  { name: "Agency", price: "$49", period: "/mo", desc: "Automate your client reporting.", features: ["Everything in Pro", "White-label PDF Reports", "Competitor benchmarks", "API access for integrations", "Bulk URL analysis"], cta: "Contact Sales", popular: false },
];

export default function Home() {
  useScrollReveal();
  return (
    <main className="relative z-[1]" style={{ paddingTop: 60 }}>
      {/* Nav */}
      <Navbar />
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] text-center relative">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] blur-[60px] pointer-events-none z-[-1]" />
        <div className="max-w-[1120px] mx-auto px-6">
          <h1 className="text-[clamp(3.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.06em] mb-6 anim-up anim-up-2">
            How good is your<br /><span className="text-white" style={{ textShadow: "0 0 30px rgba(255,255,255,0.1)" }}>landing page?</span>
          </h1>
          <p className="text-[1.15rem] text-[var(--text-2)] max-w-[520px] mx-auto mb-12 leading-relaxed font-light anim-up anim-up-3">
            AI-powered analysis across 7 dimensions.<br />Get your score in 30 seconds.
          </p>
          <div className="anim-up anim-up-4"><UrlInput /></div>
          <div className="mt-14 text-[var(--text-3)] text-[0.82rem] anim-up anim-up-5">
            <span className="block mb-3.5 tracking-wide">Trusted by 2,000+ marketers and founders</span>
            <div className="flex justify-center gap-9 items-center opacity-30 grayscale hover:opacity-50 transition-opacity">
              {["Acme", "Vercel", "Linear", "Stripe", "Notion"].map((n) => (
                <svg key={n} viewBox="0 0 80 20" className="h-5"><text x="0" y="16" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#475569">{n}</text></svg>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 7 Dimensions */}
      <section className="py-[80px]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--color-cyan)] mb-1">7 Dimensions</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.06em]">Every angle, one score</h2>
            <p className="text-[var(--text-2)] mt-2">We analyze your landing page across 7 critical dimensions that determine conversion success.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px bg-white/[0.03] rounded-[14px] overflow-hidden border border-white/[0.03]">
            {dims.map((d, i) => (
              <div key={i} className={`text-center py-7 px-4 bg-[var(--bg)] transition-all duration-300 group reveal reveal-delay-${i + 1}`} style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 0 rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-center mx-auto mb-3.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" className="opacity-70 group-hover:stroke-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">{d.icon}</svg>
                </div>
                <h3 className="text-[0.9rem] font-medium mb-1.5">{d.name}</h3>
                <p className="text-[0.78rem] text-[var(--text-3)] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-[80px]" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--color-cyan)] mb-1">How It Works</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.06em]">Three steps to a better page</h2>
          </div>
          <div className="flex border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-card)] max-md:flex-col">
            {steps.map((s, i) => (
              <div key={i} className={`flex-1 p-6 text-left reveal reveal-delay-${i + 1} ${i < 2 ? "border-r border-[var(--border)] max-md:border-r-0 max-md:border-b" : ""}`}>
                <div className="font-mono font-medium text-[0.7rem] text-[var(--color-cyan)] opacity-80 mb-2">{s.num}</div>
                <h3 className="text-[1.1rem] font-medium mb-2">{s.title}</h3>
                <p className="text-[0.88rem] text-[var(--text-2)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-[80px]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--color-cyan)] mb-1">Pricing</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.06em]">Start free, scale as you grow</h2>
            <p className="text-[var(--text-2)] mt-2">No credit card required for the free plan.</p>
          </div>
          <div className="grid grid-cols-3 gap-5 items-start max-md:grid-cols-1">
            {plans.map((p, i) => (
              <div key={i} className={`p-8 rounded-[14px] border transition-all duration-300 reveal-scale reveal-delay-${i + 1} ${p.popular ? "border-white/10 bg-black scale-[1.04] relative" : "bg-[var(--bg-card)] border-[var(--border)] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"}`}>
                {p.popular && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-sky)] text-white text-[0.7rem] font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-[0_4px_16px_rgba(99,102,241,0.3)]">Most Popular</div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </>
                )}
                <p className="font-bold text-[1.1rem]">{p.name}</p>
                <p className="font-extrabold text-[2.4rem] font-mono tracking-tight mt-3 mb-1">{p.price}<span className="text-[0.9rem] font-normal text-[var(--text-3)]"> {p.period}</span></p>
                <p className="text-[0.82rem] text-[var(--text-3)] mb-5">{p.desc}</p>
                <ul className="mb-6 space-y-1.5">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-[0.85rem] text-[var(--text-2)]">
                      <span className="w-4 h-4 rounded-full bg-[rgba(34,197,94,0.12)] flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signin" className={`block w-full text-center py-2.5 rounded-[10px] text-[0.9rem] font-semibold transition-all ${p.popular ? "bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-sky)] text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)]" : "border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-[80px]">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--color-cyan)] mb-1">FAQ</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.06em]">Common questions</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-[1] border-t border-[var(--border)] pt-12 pb-6 mt-20">
        <div className="max-w-[1120px] mx-auto px-6 flex justify-between gap-10 max-md:flex-col max-md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="14" fill="#0f172a"/><path d="M 12 46 A 22 22 0 0 1 46 24" stroke="url(#fg)" strokeWidth="6" strokeLinecap="round" fill="none"/><defs><linearGradient id="fg" x1="12" y1="46" x2="46" y2="24"><stop offset="0%" stopColor="#EF4444"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs></svg>
              <span className="font-bold text-sm">PageScore</span>
            </div>
            <p className="text-[0.82rem] text-[var(--text-3)]">&copy; 2026 PageScore. All rights reserved.</p>
          </div>
          <div className="flex gap-16 max-md:gap-6">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--text-3)] mb-3">Product</p>
              <div className="flex flex-col gap-1.5">
                <Link href="#" className="text-[0.85rem] text-[var(--text-3)] hover:text-[var(--text)]">Features</Link>
                <Link href="#pricing" className="text-[0.85rem] text-[var(--text-3)] hover:text-[var(--text)]">Pricing</Link>
                <Link href="/auth/signin" className="text-[0.85rem] text-[var(--text-3)] hover:text-[var(--text)]">Sign In</Link>
              </div>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--text-3)] mb-3">Legal</p>
              <div className="flex flex-col gap-1.5">
                <Link href="#" className="text-[0.85rem] text-[var(--text-3)] hover:text-[var(--text)]">Privacy</Link>
                <Link href="#" className="text-[0.85rem] text-[var(--text-3)] hover:text-[var(--text)]">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
