"use client";
import { Crown } from "lucide-react";

const planColors: Record<string, string> = {
  FREE: "border-zinc-700 text-zinc-400",
  PRO: "border-cyan-500/50 text-cyan-400",
  AGENCY: "border-amber-500/50 text-amber-400",
};

export function PlanBadge({ plan }: { plan: string }) {
  const isPaid = plan !== "FREE";
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded border font-medium ${planColors[plan] || planColors.FREE}`}>
        {isPaid && <Crown className="w-3 h-3 inline mr-1" />}
        {plan}
      </span>
      {!isPaid && (
        <button
          onClick={async () => {
            const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'PRO' }) })
            const { url } = await res.json()
            if (url) window.location.href = url
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}
