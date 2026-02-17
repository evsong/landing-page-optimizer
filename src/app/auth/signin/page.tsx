"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent mb-8">
          PageScore
        </Link>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h1 className="text-lg font-semibold text-center mb-6">Sign in</h1>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          {sent ? (
            <p className="text-sm text-center text-cyan-400">Check your email for a sign-in link.</p>
          ) : (
            <form onSubmit={handleEmail}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm outline-none focus:border-cyan-500/50 transition-colors mb-3"
                required
              />
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                Send magic link
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
