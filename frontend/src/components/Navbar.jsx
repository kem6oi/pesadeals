import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ isMetaMode }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-4 py-2.5">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2.5 group min-w-0">
          <Logo size={36} className="group-hover:scale-105 transition-transform shadow-sm rounded-[11px]" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">PesaDeals</span>
              <span className="text-[10px] font-bold text-[#008744] bg-[#008744]/10 border border-[#008744]/20 px-1.5 py-0.5 rounded-md">
                KENYA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">Independent Side Hustle Tips & Guides</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          {isMetaMode && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008744]" />
              <span>Verified Guides</span>
            </div>
          )}

          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 active:scale-95 transition-all"
            title="Admin Login & Analytics"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
