"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How does PageScore analyze my landing page?",
    a: "We use a 3-layer analysis pipeline: Puppeteer loads your page and captures a screenshot, Lighthouse audits performance and SEO, and AI Vision analyzes design quality and generates actionable suggestions. The entire process takes about 30 seconds.",
  },
  {
    q: "What makes PageScore different from PageSpeed Insights?",
    a: "PageSpeed only checks technical performance. PageScore analyzes 7 dimensions including copy quality, conversion optimization, and visual design — and gives you specific, actionable suggestions on what to change, not just what's wrong.",
  },
  {
    q: "Is my landing page data kept private?",
    a: "Yes. We only analyze publicly accessible pages. Screenshots and analysis data are stored securely and only visible to your account. We never share your data with third parties.",
  },
  {
    q: "Can I analyze competitor landing pages?",
    a: "Absolutely. You can analyze any public URL. Agency plan users get a dedicated side-by-side comparison feature that highlights differences across all 7 dimensions with AI-generated insights.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "Our scoring combines objective metrics (Lighthouse data, DOM analysis) with AI evaluation. Performance and SEO scores are based on industry-standard tools. Design and copy scores use Claude AI vision, calibrated against thousands of high-converting landing pages.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-[var(--border)]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left font-semibold text-[0.95rem] text-[var(--text)] hover:text-[var(--color-cyan)] transition-colors"
          >
            <span>{faq.q}</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round"
              className={`shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
            >
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-350"
            style={{ maxHeight: open === i ? "200px" : "0", paddingBottom: open === i ? "20px" : "0" }}
          >
            <p className="text-[0.9rem] text-[var(--text-2)] leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
