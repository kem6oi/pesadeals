import React from 'react';
import { CheckCircle2, ArrowRight, Share2, Smartphone, Zap } from 'lucide-react';

export default function DealCard({ deal, onSelect, onDirectClaim }) {
  const shareOnWhatsApp = (e) => {
    e.stopPropagation();
    const shareUrl = `https://pesadeals.duckdns.org/r/${deal.slug}?utm_source=whatsapp_share`;
    const text = encodeURIComponent(
      `Check out this verified Kenya deal: "${deal.title}" (Earns ${deal.payout_range} via ${deal.payment_method}). Apply here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {deal.category}
          </span>
          <span className="text-xs font-bold text-[#008744] bg-[#008744]/10 border border-[#008744]/20 px-2.5 py-0.5 rounded-full tabular-nums">
            {deal.payout_range}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {deal.title}
        </h2>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {deal.summary}
        </p>

        {/* Key Real-World Meta Specs */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] mb-3">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Zap className="w-3.5 h-3.5 text-[#008744] shrink-0" />
            <span className="font-semibold text-slate-900">{deal.payment_method}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{deal.difficulty || 'Easy'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelect(deal)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            title="Share to WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onDirectClaim(deal)}
          className="flex items-center gap-1.5 bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all"
        >
          <span>Start Deal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
