import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Filter, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import DealCard from './components/DealCard';
import DealModal from './components/DealModal';
import AdminPortal from './components/AdminPortal';
import ComplianceModal from './components/ComplianceModal';
import { fetchDeals, trackAndOpenDeal, isMetaTraffic } from './api';

const CATEGORIES = [
  { id: 'all', label: 'All Deals' },
  { id: 'microtasks', label: 'Microtasks' },
  { id: 'freelance', label: 'Freelance & Writing' },
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

  // Check URL params for admin auto-open or meta traffic
  useEffect(() => {
    const isMeta = isMetaTraffic();
    setMetaSafeActive(isMeta);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || window.location.pathname === '/admin') {
      setAdminOpen(true);
    }
  }, []);

  // Fetch deals when category or search changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchDeals(selectedCategory, searchQuery);
      setDeals(data.deals || []);
      setLoading(false);
    };

    const debounce = setTimeout(load, 200);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery]);

  const handleClaim = (deal) => {
    trackAndOpenDeal(deal);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        onOpenAdmin={() => setAdminOpen(true)}
        isMetaMode={metaSafeActive}
      />

      {/* Hero / Filter Bar */}
      <section className="px-4 pt-4 pb-2 max-w-3xl mx-auto w-full">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search deals (e.g. M-Pesa, surveys, typing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Deals Feed */}
      <main className="flex-1 px-4 py-2 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold text-slate-400">
            {loading ? 'Finding deals...' : `${deals.length} Opportunities Available`}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">
            Verified M-Pesa Ready
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 py-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800/50" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800/80 p-6 my-4">
            <p className="text-sm text-slate-300 font-medium mb-1">No deals match your search</p>
            <p className="text-xs text-slate-400 mb-4">Try selecting another category or clear the search query.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs text-emerald-400 font-medium underline"
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
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 px-4 py-6 text-center text-xs text-slate-400">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto">
            PesaDeals Kenya connects Kenyans with verified digital side gigs, remote tasks, and partner programs. We do not charge any registration fees. Earning outcomes depend on individual commitment and task availability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400 pt-2 border-t border-slate-900">
            <button onClick={() => setComplianceType('disclaimer')} className="hover:text-emerald-400 transition-colors">
              Earnings Disclaimer
            </button>
            <button onClick={() => setComplianceType('privacy')} className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setComplianceType('terms')} className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setComplianceType('contact')} className="hover:text-emerald-400 transition-colors">
              Contact
            </button>
          </div>

          <p className="text-[10px] text-slate-500 pt-1">
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
