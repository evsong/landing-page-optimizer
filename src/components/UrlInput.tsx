"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      router.push(`/report/${data.reportId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-cyan-500/50 transition-colors">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-landing-page.com"
          className="flex-1 bg-transparent px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Analyzing...
            </span>
          ) : "Analyze"}
        </button>
      </div>
      {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}
