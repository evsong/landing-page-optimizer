interface DimensionBarProps {
  label: string;
  score: number | null;
  icon?: React.ReactNode;
}

export function DimensionBar({ label, score, icon }: DimensionBarProps) {
  if (score === null) {
    return (
      <div className="flex items-center gap-3 py-2">
        {icon && <span className="text-zinc-500 w-5">{icon}</span>}
        <span className="text-sm text-zinc-400 w-32">{label}</span>
        <span className="text-xs text-zinc-600">N/A</span>
      </div>
    );
  }

  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-3 py-2">
      {icon && <span className="text-zinc-400 w-5">{icon}</span>}
      <span className="text-sm text-zinc-300 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-mono text-zinc-300 w-8 text-right">{score}</span>
    </div>
  );
}
