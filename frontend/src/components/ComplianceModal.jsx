import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function ComplianceModal({ type, onClose }) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 max-h-[85vh] overflow-y-auto text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 className="text-sm font-bold text-white capitalize">
            {type === 'disclaimer' && 'Earnings & Risk Disclaimer'}
            {type === 'privacy' && 'Privacy Policy'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'contact' && 'Support & Contact'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'disclaimer' && (
          <div className="space-y-3 leading-relaxed">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300">
                Meta Advertising Compliance Notice: PesaDeals Kenya is an informational index and directory of third-party digital work and affiliate opportunities.
              </p>
            </div>
            <p>
              <strong>1. No Guarantee of Income:</strong> Stated earnings ranges (e.g. KES 800 - 3,500/day) reflect potential estimations based on reported contributor payout rates. Actual results vary significantly based on your individual device, internet quality, skill level, and hours worked.
            </p>
            <p>
              <strong>2. Independent Providers:</strong> All tasks, surveys, and affiliate programs are operated by independent third-party platforms (such as Outlier, Premise, Jumia, ySense). PesaDeals is not an employer and does not issue direct payroll.
            </p>
            <p>
              <strong>3. Never Pay to Work:</strong> We strictly index opportunities that are free to join. Never send money or pay registration fees for online tasks.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-3 leading-relaxed">
            <p>
              We respect your privacy. PesaDeals collects non-personally identifiable diagnostic and referral information (device type, operating system, referrer, and UTM campaign parameters) solely to measure traffic effectiveness and improve link availability.
            </p>
            <p>
              We do not sell personal information or share individual identities with third parties.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-3 leading-relaxed">
            <p>
              By accessing PesaDeals, you agree that information provided is for educational and directory purposes. Users must be at least 18 years old or the legal age of majority in Kenya to participate in online freelance contracts.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-3 leading-relaxed">
            <p>Have an inquiry or want to report a broken deal link?</p>
            <p className="font-semibold text-white">Email: support@pesadeals.co.ke</p>
            <p className="text-slate-400">Nairobi, Kenya</p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 mt-5">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
