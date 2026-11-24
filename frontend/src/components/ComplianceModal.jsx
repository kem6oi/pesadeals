import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function ComplianceModal({ type, onClose }) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 max-h-[85vh] overflow-y-auto text-xs text-slate-600 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-sm font-bold text-slate-900 capitalize">
            {type === 'disclaimer' && 'Earnings & Risk Disclaimer'}
            {type === 'privacy' && 'Privacy Policy'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'contact' && 'Support & Contact'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'disclaimer' && (
          <div className="space-y-3 leading-relaxed">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-900 font-medium">
                Meta Ads Compliance Notice: PesaDeals Kenya is an independent informational directory and affiliate resource.
              </p>
            </div>
            <p>
              <strong>1. No Guaranteed Income:</strong> Listed earning ranges (e.g. Ksh 1,200 – 3,500/day) reflect estimates based on provider task rates and active contributor reports. Actual results vary based on individual effort, time spent, device specifications, and project availability.
            </p>
            <p>
              <strong>2. Third-Party Platforms:</strong> All platforms indexed (such as Outlier, Premise, Jumia, ySense, TranscribeMe) are independent third parties. PesaDeals is not an employer and does not directly issue payroll.
            </p>
            <p>
              <strong>3. Zero Registration Fees:</strong> Never send money to anyone claiming to offer jobs or tasks. All verified deals listed are free to apply.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-3 leading-relaxed">
            <p>
              We respect your privacy. PesaDeals collects non-personal referral tags and device types (operating system, browser, UTM campaign) strictly to track link functionality and prevent link rot.
            </p>
            <p>
              We never sell or disclose visitor information to third parties.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-3 leading-relaxed">
            <p>
              By accessing PesaDeals Kenya, you acknowledge that information is provided for educational and gig-discovery purposes. Users must meet the minimum age requirements of the respective third-party platforms.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-3 leading-relaxed">
            <p>Have an inquiry or want to submit a deal for verification?</p>
            <p className="font-semibold text-slate-900">Email: support@pesadeals.duckdns.org</p>
            <p className="text-slate-500">Nairobi, Kenya</p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 mt-5">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
