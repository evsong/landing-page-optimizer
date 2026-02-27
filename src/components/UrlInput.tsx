"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressSteps, stepFromName } from "./ProgressSteps";

export function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setCurrentStep(0);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      // Non-stream responses (cached, errors before stream starts)
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analysis failed");
        router.push(`/report/${data.reportId}`);
        return;
      }

      if (!contentType.includes("text/event-stream")) {
        throw new Error("Analysis timed out or server error. Please try again.");
      }

      // Consume SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Failed to read response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.done && data.reportId) {
              router.push(`/report/${data.reportId}`);
              return;
            }
            if (data.step) {
              setCurrentStep(stepFromName(data.step));
            }
          } catch (parseErr: any) {
            if (parseErr.message && parseErr.message !== "Unexpected end of JSON input") {
              throw parseErr;
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-[520px] mx-auto items-center h-14 rounded-full border border-white/15 bg-[#141414] px-5 pr-1 shadow-[0_0_0_1px_rgba(0,0,0,1),0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-all focus-within:border-white/25">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" className="shrink-0">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-landing-page.com"
          className="flex-1 bg-transparent border-none text-white text-[0.95rem] font-mono tracking-tight outline-none placeholder:text-[var(--text-3)] placeholder:font-mono"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="shrink-0 rounded-full px-6 h-[46px] font-semibold text-white bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-sky)] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] disabled:opacity-50 transition-all whitespace-nowrap"
        >
          {loading ? "Analyzing..." : "Analyze Free"}
        </button>
      </form>
      {loading && (
        <div className="mt-4">
          <ProgressSteps current={currentStep} />
        </div>
      )}
      {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
    </>
  );
}
