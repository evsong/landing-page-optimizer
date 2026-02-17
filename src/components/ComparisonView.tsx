"use client";
import { ScoreRing } from "./ScoreRing";
import { DimensionBar } from "./DimensionBar";
import { Trophy } from "lucide-react";

interface ReportData {
  url: string;
  overallScore: number;
  letterGrade: string;
  structureScore: number;
  designScore: number;
  copyScore: number;
  conversionScore: number;
  performanceScore: number;
  seoScore: number;
  benchmarkScore: number;
}

const dimensions = [
  { key: "structureScore", label: "Structure" },
  { key: "designScore", label: "Design" },
  { key: "copyScore", label: "Copy" },
  { key: "conversionScore", label: "Conversion" },
  { key: "performanceScore", label: "Performance" },
  { key: "seoScore", label: "SEO" },
  { key: "benchmarkScore", label: "Benchmark" },
] as const;

export function ComparisonView({ reportA, reportB }: { reportA: ReportData; reportB: ReportData }) {
  return (
    <div className="space-y-8">
      {/* Overall scores */}
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <p className="text-xs text-zinc-500 truncate mb-3">{reportA.url}</p>
          <ScoreRing score={reportA.overallScore} grade={reportA.letterGrade} size={120} />
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500 truncate mb-3">{reportB.url}</p>
          <ScoreRing score={reportB.overallScore} grade={reportB.letterGrade} size={120} />
        </div>
      </div>

      {/* Dimension comparison */}
      <div className="space-y-3">
        {dimensions.map(({ key, label }) => {
          const a = reportA[key];
          const b = reportB[key];
          const winner = a > b ? "A" : b > a ? "B" : null;
          return (
            <div key={key} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <DimensionBar label="" score={a} />
              <div className="flex items-center gap-1 min-w-[90px] justify-center">
                {winner === "A" && <Trophy className="w-3 h-3 text-cyan-400" />}
                <span className="text-xs text-zinc-400 font-medium">{label}</span>
                {winner === "B" && <Trophy className="w-3 h-3 text-cyan-400" />}
              </div>
              <DimensionBar label="" score={b} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
