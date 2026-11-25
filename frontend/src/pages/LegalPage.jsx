import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Info } from 'lucide-react';

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
          <span>Back to Tips</span>
        </Link>
      </div>

      <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-xs text-slate-600 leading-relaxed">
        <h1 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-4 capitalize">
          {type === 'disclaimer' && 'Non-Affiliation & Earnings Disclaimer'}
          {type === 'privacy' && 'Privacy Policy'}
          {type === 'terms' && 'Terms of Service'}
          {type === 'contact' && 'Support & Contact'}
        </h1>

        {type === 'disclaimer' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-950 font-semibold leading-relaxed">
                Important Notice: PesaDeals Kenya is an independent informational and educational blog. We are not affiliated with, endorsed by, or representing any platform or company featured on this website. We only share independent tips and guides.
              </p>
            </div>

            <p>
              <strong>1. Strict Non-Affiliation:</strong> All product names, logos, brands, and trademarks displayed on this site are the property of their respective trademark holders. The use of these names does not imply any affiliation, sponsorship, or official endorsement.
            </p>
            <p>
              <strong>2. We Only Share Tips:</strong> Content published on PesaDeals Kenya is compiled solely for informational, educational, and discussion purposes. We are not an employer, broker, agent, or financial institution.
            </p>
            <p>
              <strong>3. No Income Guarantees:</strong> Any stated earnings ranges reflect reported estimations. Individual results depend completely on personal skill, dedication, internet access, and third-party task availability.
            </p>
            <p>
              <strong>4. Free Information:</strong> We do not charge fees or ask for payments. Never send money to anyone promising online employment.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-3">
            <p>
              We respect your privacy. PesaDeals Kenya collects basic diagnostic metrics (such as device type and link click counts) solely to verify that link destinations are active and working.
            </p>
            <p>
              We do not sell, rent, or share personal visitor data with third parties.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-3">
            <p>
              By accessing PesaDeals Kenya, you acknowledge that all content represents independent opinions and tips. Users are solely responsible for conducting their own due diligence before signing up on any third-party external service.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-3">
            <p>Have a question or want to report an outdated tip?</p>
            <p className="font-bold text-slate-900 text-sm">Email: support@pesadeals.duckdns.org</p>
            <p className="text-slate-500">Nairobi, Kenya</p>
          </div>
        )}
      </article>
    </div>
  );
}
