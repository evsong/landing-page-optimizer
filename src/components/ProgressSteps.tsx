"use client";
import { Loader2, Search, Brain, FileText } from "lucide-react";

const steps = [
  { label: "Loading", icon: Loader2 },
  { label: "Auditing", icon: Search },
  { label: "AI Analysis", icon: Brain },
  { label: "Report", icon: FileText },
];

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const active = i === current;
        const done = i < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
              done ? "bg-zinc-800 text-zinc-400" : "bg-zinc-900 text-zinc-600"
            }`}>
              <Icon className={`w-3.5 h-3.5 ${active ? "animate-spin" : ""}`} />
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px ${done ? "bg-cyan-500/50" : "bg-zinc-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
