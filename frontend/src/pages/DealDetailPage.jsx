import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle2, ShieldAlert, Zap, Share2, Info } from 'lucide-react';
import { fetchDealBySlug, trackAndOpenDeal } from '../api';

export default function DealDetailPage() {
  const { slug } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDeal = async () => {
      setLoading(true);
      const data = await fetchDealBySlug(slug);
      setDeal(data);
      setLoading(false);
    };
    loadDeal();
  }, [slug]);

  const handleClaim = () => {
    if (deal) {
      trackAndOpenDeal(deal);
    }
  };

  const handleWhatsAppShare = () => {
    if (!deal) return;
    const shareUrl = `https://pesadeals.duckdns.org/r/${deal.slug}?utm_source=whatsapp_share`;
    const text = encodeURIComponent(
      `Check out this Kenyan hustle tip: "${deal.title}" (Estimated ${deal.payout_range} via ${deal.payment_method}). Guide here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="h-48 bg-white rounded-2xl animate-pulse border border-slate-200 mb-4" />
        <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-lg font-bold text-slate-900 mb-2">Tip Not Found</h1>
        <p className="text-xs text-slate-500 mb-6">This guide may have been updated or moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tips</span>
        </Link>
      </div>
    );
  }

  const platformName = deal.title.split('—')[0].trim();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Tips</span>
        </Link>

        <button
          onClick={handleWhatsAppShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
          title="Share tip on WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5 text-[#008744]" />
          <span>Share Tip</span>
        </button>
      </div>

      {/* Main Deal Card */}
      <article className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-5">
        {/* Header Meta */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {deal.category}
          </span>
          {deal.badge && (
            <span className="text-[11px] font-bold text-[#008744] bg-[#008744]/10 border border-[#008744]/20 px-2.5 py-0.5 rounded-full">
              {deal.badge}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
          {deal.title}
        </h1>

        {/* Non-Affiliation Box */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2 mb-4 text-[11px] text-amber-950">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> We are not affiliated with {platformName} or its owners. We only share independent tips and guides on how Kenyans can use it.
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {deal.summary}
        </p>

        {/* Highlight Stats Box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Reported Earnings</span>
            <span className="text-sm sm:text-base font-black text-slate-900 tabular-nums">
              {deal.payout_range}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Payout Method</span>
            <span className="text-sm sm:text-base font-black text-[#008744] flex items-center gap-1">
              <Zap className="w-4 h-4 shrink-0" />
              <span>{deal.payment_method}</span>
            </span>
          </div>
        </div>

        {/* Detailed Description */}
        {deal.description && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Full Guide & Tips
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {deal.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {deal.requirements && deal.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Requirements
            </h2>
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {deal.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#008744] shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {deal.steps && deal.steps.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              How to Get Started
            </h2>
            <ol className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {deal.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-[#008744] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Security Box */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 mb-6">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-normal font-medium">
            <strong>Security Notice:</strong> All tips and opportunities we share are free to explore. Never send money or pay registration fees for online work.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleClaim}
            className="w-full flex items-center justify-center gap-2 bg-[#008744] hover:bg-[#007038] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Visit {platformName} (External Website)</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Opens external third-party website in a new window.
          </p>
        </div>
      </article>

      {/* Back button at footer */}
      <div className="text-center pb-8">
        <Link
          to="/"
          className="text-xs font-bold text-[#008744] hover:underline"
        >
          ← Browse More Money-Making Tips
        </Link>
      </div>
    </div>
  );
}
