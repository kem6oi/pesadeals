import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import DealCard from './components/DealCard';
import DealModal from './components/DealModal';
import AdminPortal from './components/AdminPortal';
import ComplianceModal from './components/ComplianceModal';
import { fetchDeals, trackAndOpenDeal, isMetaTraffic } from './api';

const CATEGORIES = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'microtasks', label: 'Microtasks & AI' },
  { id: 'freelance', label: 'Writing & Typing' },
  { id: 'affiliate', label: 'Affiliate Partners' },
  { id: 'surveys', label: 'Paid Surveys' },
];

export default function App() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDeal, setActiveDeal] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [complianceType, setComplianceType] = useState(null);
  const [metaSafeActive, setMetaSafeActive] = useState(false);

  useEffect(() => {
    const isMeta = isMetaTraffic();
    setMetaSafeActive(isMeta);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || window.location.pathname === '/admin') {
      setAdminOpen(true);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchDeals(selectedCategory, searchQuery);
      setDeals(data.deals || []);
      setLoading(false);
    };

    const debounce = setTimeout(load, 150);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery]);

  const handleClaim = (deal) => {
    trackAndOpenDeal(deal);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        onOpenAdmin={() => setAdminOpen(true)}
        isMetaMode={metaSafeActive}
      />

      {/* Trust Notice Header */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-center">
        <p className="text-[11px] sm:text-xs font-semibold text-emerald-900 max-w-2xl mx-auto flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#008744] shrink-0" />
          <span>Verified online gigs for Kenyans. 100% free to start — no registration fees required.</span>
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <section className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search deals (e.g. M-Pesa, surveys, typing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#008744] shadow-sm transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#008744] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Deals Feed */}
      <main className="flex-1 px-4 py-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-700">
            {loading ? 'Loading deals...' : `${deals.length} Active Opportunities`}
          </span>
          <span className="text-[11px] text-[#008744] font-bold">
            M-Pesa Supported
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 my-4 shadow-sm">
            <p className="text-sm font-bold text-slate-900 mb-1">No deals match your search</p>
            <p className="text-xs text-slate-500 mb-4">Try clearing your search query or pick another category.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#008744] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pb-8">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onSelect={(d) => setActiveDeal(d)}
                onDirectClaim={handleClaim}
              />
            ))}
          </div>
        )}
      </main>

      {/* Meta Ad Safe Compliance Notice & Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl mx-auto">
            PesaDeals Kenya is an informational index of verified remote work and affiliate opportunities for Kenyans. We do not charge registration fees. Outcomes vary based on individual skill and commitment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <button onClick={() => setComplianceType('disclaimer')} className="hover:text-[#008744] transition-colors">
              Earnings Disclaimer
            </button>
            <button onClick={() => setComplianceType('privacy')} className="hover:text-[#008744] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setComplianceType('terms')} className="hover:text-[#008744] transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setComplianceType('contact')} className="hover:text-[#008744] transition-colors">
              Contact Us
            </button>
          </div>

          <p className="text-[10px] text-slate-400 pt-1">
            © {new Date().getFullYear()} PesaDeals Kenya. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <DealModal
        deal={activeDeal}
        onClose={() => setActiveDeal(null)}
        onClaim={handleClaim}
      />

      {adminOpen && (
        <AdminPortal onClose={() => setAdminOpen(false)} />
      )}

      <ComplianceModal
        type={complianceType}
        onClose={() => setComplianceType(null)}
      />
    </div>
  );
}
