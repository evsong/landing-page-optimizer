"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What does PageScore analyze?",
    a: "PageScore evaluates your landing page across 7 dimensions: structure completeness, visual design, copy quality, conversion optimization, technical performance, SEO basics, and industry benchmarks. We use Lighthouse, Pa11y, and AI vision analysis to give you a comprehensive score.",
  },
  {
    q: "How is this different from PageSpeed Insights?",
    a: "PageSpeed only checks technical performance. PageScore goes further — we analyze your copy quality, conversion elements (CTAs, trust signals, forms), visual design, and give you AI-powered rewrite suggestions. It's a complete landing page audit, not just a speed test.",
  },
  {
    q: "How many pages can I analyze for free?",
    a: "The free plan includes 3 analyses per month. Upgrade to PRO for unlimited analyses, or AGENCY for competitor comparisons and PDF exports.",
  },
  {
    q: "What AI model powers the suggestions?",
    a: "We use Claude by Anthropic for both visual design analysis (screenshot review) and copy optimization suggestions. The AI provides specific, actionable rewrites — not generic advice.",
  },
  {
    q: "Can I compare my page against a competitor?",
    a: "Yes! The AGENCY plan includes side-by-side competitor comparison. Enter two URLs and get a detailed breakdown of how each page scores across all 7 dimensions.",
  },
  {
    q: "Is my data private?",
    a: "Your analysis results are stored securely and only visible to you. We don't share your URLs or scores with anyone. Screenshots are processed in memory and not permanently stored.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-900/50 transition-colors"
          >
            <span className="text-sm font-medium text-zinc-200">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-4 pb-3">
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
