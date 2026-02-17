import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-700 mb-4">404</h1>
        <p className="text-zinc-400 mb-6">Page not found</p>
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Back to home
        </Link>
      </div>
    </main>
  );
}
