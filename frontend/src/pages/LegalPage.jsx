import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LegalPage() {
  const { type } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Deals</span>
        </Link>
      </div>

      <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-xs text-slate-600 leading-relaxed">
        <h1 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-4 capitalize">
          {type === 'disclaimer' && 'Earnings & Risk Disclaimer'}
          {type === 'privacy' && 'Privacy Policy'}
          {type === 'terms' && 'Terms of Service'}
          {type === 'contact' && 'Support & Contact'}
        </h1>

        {type === 'disclaimer' && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-900 font-medium">
                Meta Ads Compliance Notice: PesaDeals Kenya is an independent informational directory and affiliate resource.
              </p>
            </div>
            <p>
              <strong>1. No Guaranteed Income:</strong> Listed earning ranges reflect estimates based on provider task rates and active contributor reports. Actual results vary based on individual effort, time spent, device specifications, and project availability.
            </p>
            <p>
              <strong>2. Third-Party Platforms:</strong> All platforms indexed (such as TaskArena, Outlier, Premise, Jumia, ySense, Mobicredits, Lovelane, BetPalace) are independent third parties. PesaDeals is not an employer and does not directly issue payroll.
            </p>
            <p>
              <strong>3. Zero Registration Fees:</strong> Never send money to anyone claiming to offer jobs or tasks. All verified deals listed are free to apply.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-3">
            <p>
              We respect your privacy. PesaDeals collects non-personal referral tags and device types (operating system, browser, UTM campaign) strictly to track link functionality and prevent link rot.
            </p>
            <p>
              We never sell or disclose visitor information to third parties.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-3">
            <p>
              By accessing PesaDeals Kenya, you acknowledge that information is provided for educational and gig-discovery purposes. Users must meet the minimum age requirements of the respective third-party platforms.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-3">
            <p>Have an inquiry or want to submit a deal for verification?</p>
            <p className="font-bold text-slate-900 text-sm">Email: support@pesadeals.duckdns.org</p>
            <p className="text-slate-500">Nairobi, Kenya</p>
          </div>
        )}
      </article>
    </div>
  );
}
