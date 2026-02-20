"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<{ analysisCount: number; monthResetAt: string } | null>(null);
  const [brand, setBrand] = useState({ whitelabelName: "", whitelabelLogo: "", whitelabelColor: "#0ea5e9" });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const plan = (session?.user as any)?.plan || "FREE";
  const isAgency = plan === "AGENCY";
  const limits: Record<string, number> = { FREE: 3, PRO: 999, AGENCY: 999 };

  useEffect(() => {
    fetch("/api/usage").then(r => r.json()).then(data => {
      setUsage(data);
      if (data.whitelabelName) setBrand(b => ({ ...b, whitelabelName: data.whitelabelName }));
      if (data.whitelabelLogo) setBrand(b => ({ ...b, whitelabelLogo: data.whitelabelLogo }));
      if (data.whitelabelColor) setBrand(b => ({ ...b, whitelabelColor: data.whitelabelColor }));
      if (data.apiKey) setApiKey(data.apiKey);
    }).catch(() => {});
  }, []);

  async function saveBrand() {
    setSaving(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brand) });
    setSaving(false);
  }

  async function generateApiKey() {
    const res = await fetch("/api/settings/api-key", { method: "POST" });
    const data = await res.json();
    if (data.apiKey) setApiKey(data.apiKey);
  }

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

          {isAgency && (
            <>
              <h2 className="text-lg font-semibold mt-8">White-Label Branding</h2>
              <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-3">
                <div>
                  <label className="text-sm text-zinc-400">Brand Name</label>
                  <input value={brand.whitelabelName} onChange={e => setBrand(b => ({ ...b, whitelabelName: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm" placeholder="Your Company" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Logo URL</label>
                  <input value={brand.whitelabelLogo} onChange={e => setBrand(b => ({ ...b, whitelabelLogo: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Brand Color</label>
                  <input type="color" value={brand.whitelabelColor} onChange={e => setBrand(b => ({ ...b, whitelabelColor: e.target.value }))} className="mt-1 h-9 w-16 bg-zinc-800 border border-zinc-700 rounded cursor-pointer" />
                </div>
                <button onClick={saveBrand} disabled={saving} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save Brand Settings"}
                </button>
              </div>

              <h2 className="text-lg font-semibold mt-8">API Access</h2>
              <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                {apiKey ? (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Your API Key</p>
                    <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded block break-all">{apiKey}</code>
                  </div>
                ) : (
                  <button onClick={generateApiKey} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">
                    Generate API Key
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
