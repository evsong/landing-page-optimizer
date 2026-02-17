"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ComparePage() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlA: urlA.trim(), urlB: urlB.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Comparison failed");
      router.push(`/report/${data.reportAId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">PageScore</Link>
        <div />
      </nav>
      <div className="max-w-2xl mx-auto px-6 pt-16">
        <h1 className="text-2xl font-bold text-center mb-2">Competitor Comparison</h1>
        <p className="text-zinc-400 text-center mb-10">Analyze two landing pages side by side.</p>
        <form onSubmit={handleCompare} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Your page</label>
            <input
              type="text" value={urlA} onChange={e => setUrlA(e.target.value)}
              placeholder="https://your-page.com"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg outline-none focus:border-cyan-500/50 transition-colors"
              disabled={loading}
            />
          </div>
          <div className="text-center text-zinc-600 text-sm">vs</div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Competitor</label>
            <input
              type="text" value={urlB} onChange={e => setUrlB(e.target.value)}
              placeholder="https://competitor.com"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg outline-none focus:border-cyan-500/50 transition-colors"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !urlA.trim() || !urlB.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? "Analyzing both pages..." : "Compare"}
          </button>
        </form>
        <p className="text-xs text-zinc-600 text-center mt-4">Requires AGENCY plan</p>
      </div>
    </main>
  );
}
