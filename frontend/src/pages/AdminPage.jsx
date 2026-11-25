import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  ListOrdered,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Globe,
  TrendingUp,
  MousePointerClick,
  Users,
  Zap,
  Search
} from 'lucide-react';
import LoginPage from './LoginPage';
import Logo from '../components/Logo';
import { API_BASE } from '../api';

export default function AdminPage() {
  const [token, setToken] = useState(
    localStorage.getItem('pesadeals_admin_token') || localStorage.getItem('pesadeals_admin_key') || ''
  );
  const [username, setUsername] = useState(localStorage.getItem('pesadeals_admin_user') || 'admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Dashboard state
  const [tab, setTab] = useState('analytics'); // 'analytics' | 'deals' | 'form'
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [deals, setDeals] = useState([]);
  const [editingDeal, setEditingDeal] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [dealSearch, setDealSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'microtasks',
    payout_range: 'Ksh 1,500 – 4,500 / day',
    payment_method: 'Direct M-Pesa',
    badge: 'Verified',
    summary: '',
    description: '',
    affiliate_url: '',
    is_meta_safe: true,
    is_featured: false,
    status: 'active',
    requirements: 'Smartphone or Laptop\nSafaricom M-Pesa account\nGood internet connection',
    steps: 'Visit official website\nComplete onboarding test\nStart tasks and withdraw earnings'
  });

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'X-Admin-Key': token,
    'Content-Type': 'application/json'
  };

  const verifyAuth = async (tokenToCheck) => {
    if (!tokenToCheck) {
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToCheck}`,
          'X-Admin-Key': tokenToCheck
        },
        body: JSON.stringify({ token: tokenToCheck })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.username) setUsername(data.username);
        loadDashboardData(tokenToCheck);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('pesadeals_admin_token');
        localStorage.removeItem('pesadeals_admin_key');
      }
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    verifyAuth(token);
  }, []);

  const loadDashboardData = async (activeToken) => {
    setLoading(true);
    const headers = {
      'Authorization': `Bearer ${activeToken || token}`,
      'X-Admin-Key': activeToken || token
    };

    try {
      const [resAnalytics, resDeals] = await Promise.all([
        fetch(`${API_BASE}/api/admin/analytics`, { headers }),
        fetch(`${API_BASE}/api/admin/deals`, { headers })
      ]);

      if (resAnalytics.ok) {
        setAnalytics(await resAnalytics.json());
      }
      if (resDeals.ok) {
        const data = await resDeals.json();
        setDeals(data.deals || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
    loadDashboardData(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('pesadeals_admin_token');
    localStorage.removeItem('pesadeals_admin_key');
    localStorage.removeItem('pesadeals_admin_user');
    setToken('');
    setIsAuthenticated(false);
  };

  const copyTrackingLink = (slug) => {
    const url = `https://pesadeals.pages.dev/deal/${slug}?utm_source=meta&utm_campaign=ad_campaign_1`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggleMetaSafe = async (deal) => {
    try {
      const updated = !deal.is_meta_safe;
      await fetch(`${API_BASE}/api/admin/deals/${deal.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ is_meta_safe: updated })
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (deal) => {
    try {
      const updated = deal.status === 'active' ? 'paused' : 'active';
      await fetch(`${API_BASE}/api/admin/deals/${deal.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status: updated })
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" permanently?`)) return;
    try {
      await fetch(`${API_BASE}/api/admin/deals/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title || '',
      slug: deal.slug || '',
      category: deal.category || 'microtasks',
      payout_range: deal.payout_range || '',
      payment_method: deal.payment_method || 'Direct M-Pesa',
      badge: deal.badge || '',
      summary: deal.summary || '',
      description: deal.description || '',
      affiliate_url: deal.affiliate_url || '',
      is_meta_safe: Boolean(deal.is_meta_safe),
      is_featured: Boolean(deal.is_featured),
      status: deal.status || 'active',
      requirements: (deal.requirements || []).join('\n'),
      steps: (deal.steps || []).join('\n')
    });
    setTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      slug: '',
      category: 'microtasks',
      payout_range: 'Ksh 1,500 – 4,500 / day',
      payment_method: 'Direct M-Pesa',
      badge: 'Verified',
      summary: '',
      description: '',
      affiliate_url: '',
      is_meta_safe: true,
      is_featured: false,
      status: 'active',
      requirements: 'Smartphone or Laptop\nSafaricom M-Pesa account\nGood internet connection',
      steps: 'Visit official website\nComplete onboarding test\nStart tasks and withdraw earnings'
    });
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(Boolean),
      steps: formData.steps.split('\n').filter(Boolean),
      is_meta_safe: Boolean(formData.is_meta_safe),
      is_featured: Boolean(formData.is_featured)
    };

    try {
      const url = editingDeal
        ? `${API_BASE}/api/admin/deals/${editingDeal.id}`
        : `${API_BASE}/api/admin/deals`;
      const method = editingDeal ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        resetForm();
        setTab('deals');
        loadDashboardData();
      } else {
        const errData = await res.json();
        alert('Failed to save deal: ' + (errData.error || 'Server error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-xs text-slate-500">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008744]" />
        <span>Loading admin console...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const filteredDeals = deals.filter((d) =>
    d.title.toLowerCase().includes(dealSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(dealSearch.toLowerCase()) ||
    (d.slug && d.slug.toLowerCase().includes(dealSearch.toLowerCase()))
  );

  const metaSafeCount = deals.filter((d) => d.is_meta_safe && d.status === 'active').length;
  const gatedCount = deals.filter((d) => !d.is_meta_safe && d.status === 'active').length;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-24 sm:py-6 text-slate-900">
      {/* Compact Mobile-First Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            to="/"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm active:scale-95 transition-all shrink-0"
            title="Back to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Logo size={34} className="hidden sm:block rounded-lg shadow-sm" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                Admin Console
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008744] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              Signed in as <span className="font-semibold text-slate-700">{username}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadDashboardData()}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 p-2.5 sm:px-3 sm:py-2 rounded-xl shadow-sm active:scale-95 transition-all"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#008744]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 p-2.5 sm:px-3 sm:py-2 rounded-xl shadow-sm active:scale-95 transition-all"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Tiles */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clicks</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-[#008744]">
                <MousePointerClick className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {analytics.summary.totalClicks}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">All-time redirects</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Visitors</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-[#008744]">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-[#008744] tabular-nums">
              {analytics.summary.uniqueVisitors}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Unique users</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today</span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {analytics.summary.todayClicks}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Last 24 hours</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Listings</span>
              <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Zap className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {deals.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{metaSafeCount} Meta-safe • {gatedCount} gated</p>
          </div>
        </div>
      )}

      {/* Desktop Navigation Tabs (Hidden on small mobile where bottom nav handles switching) */}
      <div className="hidden sm:flex items-center gap-2 border-b border-slate-200 mb-6 pb-3">
        <button
          onClick={() => setTab('analytics')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
            tab === 'analytics'
              ? 'bg-[#008744] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Click Tracking & Traffic</span>
        </button>

        <button
          onClick={() => setTab('deals')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
            tab === 'deals'
              ? 'bg-[#008744] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Manage Deals ({deals.length})</span>
        </button>

        <button
          onClick={() => { resetForm(); setTab('form'); }}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ml-auto ${
            tab === 'form'
              ? 'bg-[#008744] text-white shadow-sm'
              : 'bg-emerald-50 text-[#008744] border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingDeal ? 'Editing Deal' : 'Add New Deal'}</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: REAL-TIME ANALYTICS & TRAFFIC */}
      {/* =================================================================== */}
      {tab === 'analytics' && analytics && (
        <div className="space-y-4 sm:space-y-6">
          {/* Deal Conversion Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-sm font-extrabold text-slate-900">
                Top Performing Deals
              </h2>
              <p className="text-xs text-slate-500">
                Click volume and unique visitors per link
              </p>
            </div>

            {/* Mobile Card List */}
            <div className="sm:hidden space-y-2.5">
              {analytics.topDeals.map((d, idx) => (
                <div key={d.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        #{idx + 1} • {d.category}
                      </span>
                      <Link
                        to={`/deal/${d.slug || d.id}`}
                        className="text-xs font-bold text-slate-900 hover:text-[#008744] line-clamp-1"
                      >
                        {d.title}
                      </Link>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#008744] tabular-nums block leading-none">
                        {d.tracked_clicks}
                      </span>
                      <span className="text-[10px] text-slate-500 tabular-nums">
                        {d.unique_users} unique
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyTrackingLink(d.slug || d.id)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 active:scale-95 py-2 rounded-lg transition-all"
                  >
                    {copiedSlug === (d.slug || d.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#008744]" />
                        <span className="text-[#008744]">Tracking Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Meta Tracking Link</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-1">Deal Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Total Clicks</th>
                    <th className="pb-3 text-right">Unique Users</th>
                    <th className="pb-3 text-right pr-1">Tracking Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {analytics.topDeals.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-1">
                        <Link to={`/deal/${d.slug || d.id}`} className="font-bold text-slate-900 hover:text-[#008744]">
                          {d.title}
                        </Link>
                      </td>
                      <td className="py-3 capitalize text-slate-500 font-medium">{d.category}</td>
                      <td className="py-3 text-right font-black text-[#008744] tabular-nums">
                        {d.tracked_clicks}
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-700 tabular-nums">
                        {d.unique_users}
                      </td>
                      <td className="py-3 text-right pr-1">
                        <button
                          onClick={() => copyTrackingLink(d.slug || d.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                          title="Copy tracking URL for Meta Ads"
                        >
                          {copiedSlug === (d.slug || d.id) ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#008744]" />
                              <span className="text-[#008744]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Attribution & Devices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traffic Channels */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-0.5">
                Traffic Sources
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Attributed from UTM tags & referrers
              </p>

              <div className="space-y-3">
                {analytics.trafficSources.length === 0 ? (
                  <p className="text-xs text-slate-400">No traffic sources logged yet.</p>
                ) : (
                  analytics.trafficSources.map((s, idx) => {
                    const totalClicks = analytics.summary.totalClicks || 1;
                    const pct = Math.round((s.clicks / totalClicks) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 capitalize">
                            {s.source_channel === 'meta' ? 'Meta Ads (Facebook & IG)' : s.source_channel}
                          </span>
                          <span className="text-slate-500 tabular-nums">
                            <strong className="text-slate-900">{s.clicks}</strong> ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#008744] h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Devices Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-0.5">
                Devices Used
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Mobile vs desktop visitors
              </p>

              <div className="space-y-3">
                {analytics.devices.length === 0 ? (
                  <p className="text-xs text-slate-400">No device data logged yet.</p>
                ) : (
                  analytics.devices.map((dev, idx) => {
                    const totalClicks = analytics.summary.totalClicks || 1;
                    const pct = Math.round((dev.clicks / totalClicks) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                            {dev.device_type === 'mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-[#008744]" />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span>{dev.device_type}</span>
                          </span>
                          <span className="text-slate-500 tabular-nums">
                            <strong className="text-slate-900">{dev.clicks}</strong> ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-800 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Live Click Activity Stream */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900 mb-0.5">
              Recent Click Activity
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Latest 50 tracked user redirects
            </p>

            {/* Mobile Activity Cards */}
            <div className="sm:hidden space-y-2.5">
              {analytics.recentClicks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No clicks tracked yet.</p>
              ) : (
                analytics.recentClicks.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {c.deal_name || `Deal #${c.deal_id}`}
                      </span>
                      <span className="shrink-0 text-[10px] font-bold text-[#008744] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {c.utm_source || 'direct'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize">{c.device_type} • {c.browser}</span>
                      <span className="font-mono text-[10px]">{c.ip_address}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {c.created_at} {c.utm_campaign ? `• ${c.utm_campaign}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Activity Table */}
            <div className="hidden sm:block overflow-x-auto text-xs">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Deal Destination</th>
                    <th className="pb-3">Channel / Source</th>
                    <th className="pb-3">Device & Browser</th>
                    <th className="pb-3">Visitor IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {analytics.recentClicks.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 text-slate-500 text-[11px] tabular-nums font-mono">{c.created_at}</td>
                      <td className="py-2.5 font-bold text-slate-900">
                        {c.deal_name || `Deal #${c.deal_id}`}
                      </td>
                      <td className="py-2.5">
                        <span className="font-semibold text-[#008744] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          {c.utm_source || 'direct'}
                        </span>
                        {c.utm_campaign && (
                          <span className="text-[10px] text-slate-400 ml-1">({c.utm_campaign})</span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-600 capitalize">
                        {c.device_type} • {c.browser}
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-400">{c.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: DEAL CATALOG CMS */}
      {/* =================================================================== */}
      {tab === 'deals' && (
        <div className="space-y-3.5">
          {/* Meta Ads Strategy Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#008744] shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong className="block font-extrabold">Meta Ads Landing Strategy (Option 2 Active)</strong>
              <span>
                Copy the <strong>Ad Link</strong> for a compliant guide like <strong>TaskArena</strong> (<code className="bg-white/80 px-1 rounded">/deal/taskarena?utm_source=meta</code>). Meta reviews that clean page while real Facebook visitors can browse the full catalog (including <strong>Lovelane</strong>) with full UTM attribution preserved.
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals by title, category, or slug..."
              value={dealSearch}
              onChange={(e) => setDealSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#008744] shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredDeals.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {d.category}
                      </span>
                      <span className="text-xs font-bold text-[#008744] tabular-nums">
                        {d.payout_range}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {d.title}
                    </h3>
                  </div>

                  {/* Quick Toggles */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(d)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border active:scale-95 transition-all ${
                        d.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {d.status === 'active' ? '● Active' : '○ Paused'}
                    </button>

                    <button
                      onClick={() => handleToggleMetaSafe(d)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border active:scale-95 transition-all ${
                        d.is_meta_safe
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {d.is_meta_safe ? '🛡️ Meta Safe' : '⚠️ Hidden from Meta'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {d.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span>Clicks: <strong className="text-slate-900 tabular-nums">{d.click_count || 0}</strong></span>
                    <a
                      href={d.affiliate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-[#008744] inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Touch-friendly Action Bar */}
                  <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                    <button
                      onClick={() => copyTrackingLink(d.slug || d.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-2 rounded-xl transition-all"
                    >
                      {copiedSlug === (d.slug || d.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#008744]" />
                          <span className="text-[#008744]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Ad Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEdit(d)}
                      className="inline-flex items-center justify-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 px-3 py-2 rounded-xl transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(d.id, d.title)}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 active:scale-95 rounded-xl transition-all"
                      aria-label={`Delete ${d.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: ADD / EDIT DEAL FORM */}
      {/* =================================================================== */}
      {tab === 'form' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-sm">
          <div className="mb-5 pb-4 border-b border-slate-200 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {editingDeal ? `Edit: ${editingDeal.title}` : 'Publish New Deal'}
              </h2>
              <p className="text-xs text-slate-500">
                Updates appear immediately on the public site & tracking links
              </p>
            </div>
            {editingDeal && (
              <button
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline shrink-0"
              >
                New Deal
              </button>
            )}
          </div>

          <form onSubmit={handleSaveDeal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TaskArena — Train AI Models"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. taskarena"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                >
                  <option value="microtasks">Microtasks & AI</option>
                  <option value="finance">Loans & Credit</option>
                  <option value="dating">Chat & Social (Dating)</option>
                  <option value="betting">Cashback & Promos</option>
                  <option value="freelance">Writing & Typing</option>
                  <option value="affiliate">E-Commerce & Reselling</option>
                  <option value="surveys">Paid Surveys</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Earning Potential *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ksh 1,500 – 4,500 / day"
                  value={formData.payout_range}
                  onChange={(e) => setFormData({ ...formData, payout_range: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Payout Method</label>
                <input
                  type="text"
                  placeholder="e.g. Direct M-Pesa"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1.5">
                Target Destination URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={formData.affiliate_url}
                onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1.5">Short Card Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary visible on the home feed..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1.5">Full Guide Description</label>
              <textarea
                rows={3}
                placeholder="Detailed guide for the full deal page..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Steps to Join (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#008744] focus:bg-white"
                />
              </div>
            </div>

            <label className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Meta Ads Review Safe
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Enable for safe gigs (TaskArena, surveys). Disable for dating or gambling deals so Meta bots & ad traffic never see them.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_meta_safe}
                onChange={(e) => setFormData({ ...formData, is_meta_safe: e.target.checked })}
                className="w-5 h-5 rounded text-[#008744] focus:ring-[#008744] shrink-0"
              />
            </label>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTab('deals')}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all"
              >
                {loading ? 'Saving...' : editingDeal ? 'Save Changes' : 'Publish Deal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav
        aria-label="Admin Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <button
            onClick={() => { setTab('analytics'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
              tab === 'analytics'
                ? 'text-[#008744] bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => { setTab('deals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
              tab === 'deals'
                ? 'text-[#008744] bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Deals ({deals.length})</span>
          </button>

          <button
            onClick={() => { resetForm(); setTab('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
              tab === 'form'
                ? 'text-[#008744] bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingDeal ? 'Edit' : 'Add Deal'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
