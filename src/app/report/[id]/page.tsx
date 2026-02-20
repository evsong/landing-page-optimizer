"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScoreRing } from "@/components/ScoreRing";
import { DimensionBar } from "@/components/DimensionBar";
import { IssueList } from "@/components/IssueList";
import { SuggestionCard } from "@/components/SuggestionCard";
import { LockedSection } from "@/components/LockedSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReportSkeleton } from "@/components/ReportSkeleton";
import { Layout, Eye, FileText, Zap, Gauge, Search, BarChart3, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  url: string;
  overallScore: number;
  letterGrade: string;
  structureScore: number;
  designScore: number | null;
  copyScore?: number | null;
  conversionScore: number;
  performanceScore: number;
  seoScore: number;
  benchmarkScore: number | null;
  accessibilityPenalty: number;
  issues: any[];
  suggestions: any[];
  suggestionsLocked?: boolean;
  suggestionsTotal?: number;
  copyRewrites?: any[];
  copyRewritesLocked?: boolean;
  createdAt: string;
}

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/report/${id}`)
      .then(r => r.json())
      .then(data => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-12" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">PageScore</span>
          <div className="w-12" />
        </nav>
        <ReportSkeleton />
      </main>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Report not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
          PageScore
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => window.open(`/api/report/${report.id}/pdf`)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <p className="text-sm text-zinc-500 mb-1">Analysis for</p>
          <h1 className="text-xl font-semibold truncate">{report.url}</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <ScoreRing score={report.overallScore} grade={report.letterGrade} size={180} />
          <div className="flex-1 w-full space-y-1">
            <DimensionBar label="Structure" score={report.structureScore} icon={<Layout className="w-4 h-4" />} />
            <DimensionBar label="Design" score={report.designScore} icon={<Eye className="w-4 h-4" />} />
            <DimensionBar label="Copy" score={report.copyScore ?? null} icon={<FileText className="w-4 h-4" />} />
            <DimensionBar label="Conversion" score={report.conversionScore} icon={<Zap className="w-4 h-4" />} />
            <DimensionBar label="Performance" score={report.performanceScore} icon={<Gauge className="w-4 h-4" />} />
            <DimensionBar label="SEO" score={report.seoScore} icon={<Search className="w-4 h-4" />} />
            <DimensionBar label="Benchmark" score={report.benchmarkScore} icon={<BarChart3 className="w-4 h-4" />} />
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Issues Found ({report.issues.length})</h2>
          <IssueList issues={report.issues} />
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            AI Suggestions
            {report.suggestionsLocked && <span className="text-xs text-zinc-500 ml-2">({report.suggestionsTotal} total — upgrade to see all)</span>}
          </h2>
          {report.suggestionsLocked ? (
            <>
              <div className="space-y-3 mb-4">
                {report.suggestions.map((s: any, i: number) => <SuggestionCard key={i} suggestion={s} />)}
              </div>
              <LockedSection title="Upgrade to PRO to see all suggestions" />
            </>
          ) : (
            <div className="space-y-3">
              {report.suggestions.map((s: any, i: number) => <SuggestionCard key={i} suggestion={s} />)}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Copy Rewrites</h2>
          {report.copyRewritesLocked ? (
            <LockedSection title="Upgrade to PRO to see AI copy rewrites" />
          ) : report.copyRewrites && report.copyRewrites.length > 0 ? (
            <div className="space-y-4">
              {report.copyRewrites.map((r: any, i: number) => (
                <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">{r.element}</p>
                  <p className="text-sm text-zinc-400 line-through mb-3">{r.original}</p>
                  <div className="space-y-2">
                    {r.alternatives.map((alt: string, j: number) => (
                      <p key={j} className="text-sm text-zinc-200 pl-3 border-l-2 border-cyan-500/50">{alt}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Copy score is above threshold — no rewrites needed.</p>
          )}
        </section>
      </div>
    </main>
  );
}
