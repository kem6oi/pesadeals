import React from 'react';
import { ExternalLink, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function DealCard({ deal, onSelect, onDirectClaim }) {
  return (
    <article className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 rounded-2xl p-4 transition-all duration-200 hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white leading-snug line-clamp-1">
              {deal.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-400 font-medium tabular-nums">
                {deal.payout_range}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">
                {deal.payment_method}
              </span>
            </div>
          </div>

          {deal.badge && (
            <span className="shrink-0 text-[11px] font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-700/40 px-2 py-0.5 rounded-full">
              {deal.badge}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {deal.summary}
        </p>

        {deal.requirements && deal.requirements.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{deal.requirements[0]}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(deal)}
          className="text-xs text-slate-400 hover:text-white font-medium py-1.5 px-2 rounded transition-colors"
        >
          View Instructions
        </button>

        <button
          onClick={() => onDirectClaim(deal)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <span>Start Deal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
