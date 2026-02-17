"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyRewrite {
  element: string;
  original: string;
  alternatives: string[];
}

export function CopyRewriteCard({ rewrite }: { rewrite: CopyRewrite }) {
  const [copied, setCopied] = useState<number | null>(null);

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{rewrite.element}</p>
      <p className="text-sm text-zinc-400 mb-3 line-through decoration-zinc-700">{rewrite.original}</p>
      <div className="space-y-2">
        {rewrite.alternatives.map((alt, i) => (
          <div key={i} className="flex items-start gap-2 group">
            <span className="text-xs text-cyan-500 font-mono mt-0.5">{i + 1}.</span>
            <p className="text-sm text-zinc-200 flex-1">{alt}</p>
            <button
              onClick={() => handleCopy(alt, i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-800 rounded"
              title="Copy"
            >
              {copied === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
