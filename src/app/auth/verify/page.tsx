"use client";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="block text-2xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent mb-8">
          PageScore
        </Link>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-lg font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-zinc-400">A sign-in link has been sent to your email address. Click the link to continue.</p>
        </div>
      </div>
    </main>
  );
}
