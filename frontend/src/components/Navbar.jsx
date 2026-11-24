import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Info } from 'lucide-react';

export default function Navbar({ isMetaMode }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#008744] flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform">
            PD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">PesaDeals</span>
              <span className="text-[11px] font-bold text-[#008744] bg-[#008744]/10 border border-[#008744]/20 px-1.5 py-0.5 rounded-md">
                KENYA 🇰🇪
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Independent Side Hustle Tips & Guides</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isMetaMode && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008744]" />
              <span>Independent Directory</span>
            </div>
          )}

          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors"
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
