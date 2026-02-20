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
