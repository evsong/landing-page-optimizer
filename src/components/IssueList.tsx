interface Issue {
  dimension: string;
  severity: string;
  message: string;
  code?: string;
  selector?: string;
}

export function IssueList({ issues, dimension }: { issues: Issue[]; dimension?: string }) {
  const filtered = dimension ? issues.filter(i => i.dimension === dimension) : issues;

  if (filtered.length === 0) return null;

  const severityColor = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <div className="space-y-2">
      {filtered.map((issue, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${severityColor[issue.severity as keyof typeof severityColor] || severityColor.low}`}>
            {issue.severity}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-zinc-300">{issue.message}</p>
            {issue.selector && <p className="text-xs text-zinc-600 font-mono mt-1 truncate">{issue.selector}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
