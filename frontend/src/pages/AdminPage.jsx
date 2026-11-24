import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Share2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import LoginPage from './LoginPage';
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

  // Auth verification
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
    const url = `https://pesadeals.duckdns.org/r/${slug}?utm_source=meta&utm_campaign=ad_campaign_1`;
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
    if (!window.confirm(`Delete deal "${title}" permanently?`)) return;
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
        <span>Authenticating admin console...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const filteredDeals = deals.filter(d =>
    d.title.toLowerCase().includes(dealSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(dealSearch.toLowerCase()) ||
    (d.slug && d.slug.toLowerCase().includes(dealSearch.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 text-slate-900">
      {/* Executive Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            title="View Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                PesaDeals Console
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008744] animate-pulse" />
                Live API
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Link click tracking, Meta ads safety filter & deal management
            </p>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => loadDashboardData()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
              <MousePointerClick className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {analytics.summary.totalClicks}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Tracked deal redirects</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Unique Users</span>
              <Users className="w-4 h-4 text-[#008744]" />
            </div>
            <div className="text-2xl font-black text-[#008744] tabular-nums">
              {analytics.summary.uniqueVisitors}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Distinct Kenyan visitors</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Volume</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {analytics.summary.todayClicks}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Clicks past 24 hours</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Deals</span>
              <Zap className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {deals.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Published tips & gigs</p>
          </div>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTab('analytics')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
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
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
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
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ml-auto ${
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
        <div className="space-y-6">
          {/* Top Deals Conversion Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Deal Conversion Leaderboard
                </h2>
                <p className="text-xs text-slate-500">
                  Ranked by volume of tracked click redirects
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-1">Deal Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Total Clicks</th>
                    <th className="pb-3 text-right">Unique Users</th>
                    <th className="pb-3 text-right pr-1">Meta Ad Link</th>
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
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-1">
                Traffic Attribution
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Origin channel derived from UTM source & referrer
              </p>

              <div className="space-y-3">
                {analytics.trafficSources.length === 0 ? (
                  <p className="text-xs text-slate-400">No traffic sources logged yet.</p>
                ) : (
                  analytics.trafficSources.map((s, idx) => {
                    const totalClicks = analytics.summary.totalClicks || 1;
                    const pct = Math.round((s.clicks / totalClicks) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 capitalize">
                            {s.source_channel === 'meta' ? 'Meta Ads (Facebook & IG)' : s.source_channel}
                          </span>
                          <span className="text-slate-500 tabular-nums">
                            <strong>{s.clicks}</strong> clicks ({pct}%)
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-900 mb-1">
                Device Distribution
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Mobile vs desktop engagement
              </p>

              <div className="space-y-3">
                {analytics.devices.map((dev, idx) => {
                  const totalClicks = analytics.summary.totalClicks || 1;
                  const pct = Math.round((dev.clicks / totalClicks) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                          {dev.device_type === 'mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{dev.device_type}</span>
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          <strong>{dev.clicks}</strong> ({pct}%)
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
                })}
              </div>
            </div>
          </div>

          {/* Chronological Real-Time Click Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900 mb-1">
              Live Click Activity Stream
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Real-time feed of recent deal redirect events
            </p>

            <div className="overflow-x-auto text-xs">
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
        <div className="space-y-4">
          {/* Search bar inside CMS */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search published deals by title, category, or slug..."
              value={dealSearch}
              onChange={(e) => setDealSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#008744] shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredDeals.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-base font-extrabold text-slate-900">{d.title}</span>

                    {/* Status Pill */}
                    <button
                      onClick={() => handleToggleStatus(d)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        d.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                      title="Click to toggle Active/Paused"
                    >
                      {d.status === 'active' ? '● Active' : '○ Paused'}
                    </button>

                    {/* Meta Safe Pill */}
                    <button
                      onClick={() => handleToggleMetaSafe(d)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        d.is_meta_safe
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle Meta Ads Safety"
                    >
                      {d.is_meta_safe ? '🛡️ Meta Ad Safe' : '⚠️ Gated / Organic'}
                    </button>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {d.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                    {d.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="text-[#008744] font-bold tabular-nums">{d.payout_range}</span>
                    <span>•</span>
                    <span>Total Clicks: <strong className="text-slate-900 tabular-nums">{d.click_count || 0}</strong></span>
                    <span>•</span>
                    <a
                      href={d.affiliate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Destination</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <button
                    onClick={() => copyTrackingLink(d.slug || d.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
                    title="Copy Meta Ad Redirect Link"
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
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Edit Deal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(d.id, d.title)}
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete Deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="mb-5 pb-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {editingDeal ? `Edit Deal: ${editingDeal.title}` : 'Publish New Money-Making Deal'}
              </h2>
              <p className="text-xs text-slate-500">
                All changes reflect immediately on public and tracked redirect links
              </p>
            </div>
            {editingDeal && (
              <button
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Clear / Switch to New
              </button>
            )}
          </div>

          <form onSubmit={handleSaveDeal} className="space-y-4 text-xs">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TaskArena — Train AI Models"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Slug (URL Path)</label>
                <input
                  type="text"
                  placeholder="e.g. taskarena"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>
            </div>

            {/* Category & Earnings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
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
                <label className="block text-slate-700 font-bold mb-1.5">Earning Potential *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ksh 1,500 – 4,500 / day"
                  value={formData.payout_range}
                  onChange={(e) => setFormData({ ...formData, payout_range: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Payout Method</label>
                <input
                  type="text"
                  placeholder="e.g. Direct M-Pesa"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Target Website / Affiliate URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={formData.affiliate_url}
                onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
              />
            </div>

            {/* Summary & Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Short Card Summary (1-2 sentences)</label>
              <textarea
                rows={2}
                placeholder="Brief summary visible on the home page card..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Full Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Detailed guide for the full deal page..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
              />
            </div>

            {/* Checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Steps to Join (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#008744]"
                />
              </div>
            </div>

            {/* Meta Ad Safe Toggle */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Meta Ads Review Safe
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Keep enabled for safe gigs (TaskArena, microtasks, surveys). Disable for sensitive dating/betting offers so Facebook review bots never see them.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_meta_safe}
                onChange={(e) => setFormData({ ...formData, is_meta_safe: e.target.checked })}
                className="w-5 h-5 rounded text-[#008744] focus:ring-[#008744] cursor-pointer"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTab('deals')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-extrabold shadow-sm active:scale-95 transition-all"
              >
                {loading ? 'Saving...' : editingDeal ? 'Save Deal Changes' : 'Publish Deal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
