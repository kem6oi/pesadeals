import React from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenAdmin, isMetaMode }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">PesaDeals</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                Kenya 🇰🇪
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">Verified Remote Gigs & Side Hustles</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMetaMode && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Meta Safe</span>
            </div>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            title="Admin Login & Analytics"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
