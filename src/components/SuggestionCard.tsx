interface Suggestion {
  title: string;
  impact: string;
  fix: string;
  dimension: string;
}

export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const impactColor = {
    high: "text-red-400 bg-red-500/10",
    medium: "text-yellow-400 bg-yellow-500/10",
    low: "text-zinc-400 bg-zinc-500/10",
  };

  return (
    <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${impactColor[suggestion.impact as keyof typeof impactColor] || impactColor.low}`}>
          {suggestion.impact} impact
        </span>
        <span className="text-xs text-zinc-600">{suggestion.dimension}</span>
      </div>
      <h4 className="text-sm font-medium text-zinc-200 mb-1">{suggestion.title}</h4>
      <p className="text-sm text-zinc-400">{suggestion.fix}</p>
    </div>
  );
}
