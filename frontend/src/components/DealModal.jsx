import React from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DealModal({ deal, onClose, onClaim }) {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {deal.badge && (
                <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950 border border-emerald-700/40 px-2 py-0.5 rounded-full">
                  {deal.badge}
                </span>
              )}
              <span className="text-xs text-slate-400 capitalize">{deal.category}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{deal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Est. Earnings</span>
            <span className="text-xs font-semibold text-emerald-400 tabular-nums">{deal.payout_range}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Payment Method</span>
            <span className="text-xs font-semibold text-white">{deal.payment_method}</span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Overview</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{deal.description || deal.summary}</p>
        </div>

        {/* Requirements */}
        {deal.requirements && deal.requirements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">What You Need</h3>
            <div className="space-y-1.5">
              {deal.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step by step */}
        {deal.steps && deal.steps.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">How to Start</h3>
            <ol className="space-y-2">
              {deal.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => onClaim(deal)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <span>Proceed to Deal / Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Free to join. Payout terms governed by provider.
          </p>
        </div>
      </div>
    </div>
  );
}
