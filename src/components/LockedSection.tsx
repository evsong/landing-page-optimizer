import { Lock } from "lucide-react";
import Link from "next/link";

export function LockedSection({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children || (
          <div className="space-y-3">
            <div className="h-20 bg-zinc-800/50 rounded-lg" />
            <div className="h-20 bg-zinc-800/50 rounded-lg" />
            <div className="h-20 bg-zinc-800/50 rounded-lg" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/60 rounded-lg">
        <Lock className="w-6 h-6 text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-400 mb-3">{title}</p>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Upgrade to unlock
        </Link>
      </div>
    </div>
  );
}
