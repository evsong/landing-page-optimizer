"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="bg-zinc-950 text-zinc-100">
        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-700 mb-4">Something went wrong</h1>
            <p className="text-zinc-400 mb-6">{error.message || "An unexpected error occurred"}</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
