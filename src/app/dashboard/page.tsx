"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BarChart3, Plus, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface ReportSummary {
  id: string;
  url: string;
  overallScore: number;
  letterGrade: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then(r => r.json())
        .then(data => { setReports(data.reports || []); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Sign in to view your dashboard</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg">Sign in</Link>
        </div>
      </div>
    );
  }

  const plan = (session?.user as any)?.plan || "FREE";
  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-400";
    if (grade.startsWith("B")) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen" style={{ paddingTop: 60 }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-sm rounded-lg hover:opacity-90">
            <Plus className="w-4 h-4" /> New Analysis
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-zinc-900/50 rounded-lg animate-pulse" />)}</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">No analyses yet</p>
            <p className="text-sm text-zinc-600">Analyze your first landing page to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map(report => (
              <Link key={report.id} href={`/report/${report.id}`} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <span className={`text-2xl font-bold w-12 text-center ${gradeColor(report.letterGrade)}`}>{report.letterGrade}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{report.url}</p>
                  <p className="text-xs text-zinc-600">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{report.overallScore}</span>
                  <span className="text-xs text-zinc-500">/100</span>
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-600" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
