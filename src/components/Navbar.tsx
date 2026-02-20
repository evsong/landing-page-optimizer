"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px] border-b border-[var(--border)]">
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between h-[60px]">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="14" fill="#0f172a"/><path d="M 12 46 A 22 22 0 0 1 52 46" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none"/><path d="M 12 46 A 22 22 0 0 1 46 24" stroke="url(#ng)" strokeWidth="6" strokeLinecap="round" fill="none"/><defs><linearGradient id="ng" x1="12" y1="46" x2="46" y2="24"><stop offset="0%" stopColor="#EF4444"/><stop offset="40%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs><line x1="32" y1="44" x2="44" y2="28" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="44" r="4" fill="#6366f1"/></svg>
          <span className="font-extrabold text-xl bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-sky)] bg-clip-text text-transparent">PageScore</span>
        </Link>
        <div className="hidden md:flex gap-0.5 bg-white/[0.04] rounded-lg p-[3px]">
          <Link href="/" className="px-4 py-1.5 rounded-md text-[0.85rem] font-medium text-[var(--text-3)] hover:text-[var(--text-2)]">Home</Link>
          <Link href="/dashboard" className="px-4 py-1.5 rounded-md text-[0.85rem] font-medium text-[var(--text-3)] hover:text-[var(--text-2)]">Dashboard</Link>
        </div>
        {!loading && (
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <span className="text-[0.82rem] text-[var(--text-3)] hidden sm:inline">{session.user?.email}</span>
                <Link href="/settings" className="px-3.5 py-2 text-[0.82rem] text-[var(--text-2)] hover:text-[var(--text)]">Settings</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3.5 py-[7px] text-[0.82rem] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-[10px] transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="px-3.5 py-2 text-[0.82rem] text-[var(--text-2)] hover:text-[var(--text)]">Sign In</Link>
                <Link href="/auth/signin" className="px-3.5 py-[7px] text-[0.82rem] font-semibold text-white bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-sky)] rounded-[10px] shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:-translate-y-px transition-all">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
