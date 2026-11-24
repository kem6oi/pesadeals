import React from 'react';
import { X, ExternalLink, CheckCircle2, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export default function DealModal({ deal, onClose, onClaim }) {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {deal.category}
              </span>
              <span className="text-xs font-bold text-[#008744] bg-[#008744]/10 border border-[#008744]/20 px-2 py-0.5 rounded-full tabular-nums">
                {deal.payout_range}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{deal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Est. Earning Potential</span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">{deal.payout_range}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Payout Method</span>
            <span className="text-xs font-bold text-[#008744] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>{deal.payment_method}</span>
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Overview</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{deal.description || deal.summary}</p>
        </div>

        {/* Requirements */}
        {deal.requirements && deal.requirements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Requirements</h3>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {deal.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008744] shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step by step */}
        {deal.steps && deal.steps.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">How to Get Started</h3>
            <ol className="space-y-2">
              {deal.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#008744] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Important Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-normal font-medium">
            <strong>Security Notice:</strong> All legitimate opportunities on PesaDeals are free to join. Never send money or pay registration fees for online work.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={() => onClaim(deal)}
            className="w-full flex items-center justify-center gap-2 bg-[#008744] hover:bg-[#007038] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Proceed to Official Registration</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
