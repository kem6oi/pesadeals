import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import DealCard from '../components/DealCard';
import { fetchDeals, trackAndOpenDeal, isMetaTraffic } from '../api';

const ALL_CATEGORIES = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'microtasks', label: 'Microtasks & AI' },
  { id: 'finance', label: 'Loans & Credit' },
  { id: 'dating', label: 'Chat & Social' },
  { id: 'betting', label: 'Cashback & Promos' },
  { id: 'freelance', label: 'Writing & Typing' },
  { id: 'affiliate', label: 'Affiliate Partners' },
  { id: 'surveys', label: 'Paid Surveys' },
];

export default function HomePage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const metaSafeActive = isMetaTraffic();

  const visibleCategories = metaSafeActive
    ? ALL_CATEGORIES.filter((c) => c.id !== 'dating' && c.id !== 'betting')
    : ALL_CATEGORIES;

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
    <div>
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
            placeholder="Search deals (e.g. TaskArena, M-Pesa, surveys)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#008744] shadow-sm transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {visibleCategories.map((cat) => (
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
      <main className="px-4 py-2 max-w-2xl mx-auto w-full">
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
                onDirectClaim={handleClaim}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
