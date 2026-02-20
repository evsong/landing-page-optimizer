"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<{ analysisCount: number; monthResetAt: string } | null>(null);

  useEffect(() => {
    fetch("/api/usage").then(r => r.json()).then(setUsage).catch(() => {});
  }, []);

  const plan = (session?.user as any)?.plan || "FREE";
  const limits: Record<string, number> = { FREE: 3, PRO: 999, AGENCY: 999 };

  return (
    <main className="min-h-screen" style={{ paddingTop: 60 }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-10">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
        <div className="space-y-4">
          <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-400 mb-1">Email</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-400 mb-1">Plan</p>
            <p className="font-medium">{plan}</p>
          </div>
          {usage && (
            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-400 mb-1">Analyses this month</p>
              <p className="font-medium">{usage.analysisCount} / {limits[plan] ?? "∞"}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
