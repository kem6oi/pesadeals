import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, BarChart3, ListOrdered, Smartphone, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { API_BASE } from '../api';

export default function AdminPortal({ onClose, authToken, onLogout }) {
  const [secret, setSecret] = useState(
    authToken || localStorage.getItem('pesadeals_admin_token') || localStorage.getItem('pesadeals_admin_key') || ''
  );
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(authToken));
  const [tab, setTab] = useState('analytics'); // 'analytics' | 'deals' | 'new'
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [deals, setDeals] = useState([]);
  const [editingDeal, setEditingDeal] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'microtasks',
    payout_range: 'Ksh 1,000 – 3,000 / day',
    payment_method: 'Direct M-Pesa',
    badge: 'Popular',
    summary: '',
    description: '',
    affiliate_url: '',
    is_meta_safe: true,
    is_featured: false,
    requirements: 'Smartphone with internet\nSafaricom M-Pesa line',
    steps: 'Sign up with verified phone\nComplete onboarding test\nReceive direct payout'
  });

  const checkAuth = async (keyToTest) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keyToTest}`,
          'X-Admin-Key': keyToTest
        },
        body: JSON.stringify({ token: keyToTest, secret: keyToTest })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        loadData(keyToTest);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const activeKey = authToken || secret;
    if (activeKey) {
      checkAuth(activeKey);
    }
  }, [authToken]);

  const loadData = async (key) => {
    setLoading(true);
    const activeKey = key || authToken || secret;
    const authHeader = {
      'Authorization': `Bearer ${activeKey}`,
      'X-Admin-Key': activeKey
    };
    try {
      const [resAnalytics, resDeals] = await Promise.all([
        fetch(`${API_BASE}/api/admin/analytics`, { headers: authHeader }),
        fetch(`${API_BASE}/api/admin/deals`, { headers: authHeader })
      ]);
      if (resAnalytics.ok) setAnalytics(await resAnalytics.json());
      if (resDeals.ok) {
        const d = await resDeals.json();
        setDeals(d.deals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    checkAuth(secret);
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

      const activeKey = authToken || secret;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`,
          'X-Admin-Key': activeKey
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingDeal(null);
        setTab('deals');
        resetForm();
        loadData(activeKey);
      } else {
        alert('Failed to save deal');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    try {
      const activeKey = authToken || secret;
      await fetch(`${API_BASE}/api/admin/deals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'X-Admin-Key': activeKey
        }
      });
      loadData(activeKey);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      category: deal.category,
      payout_range: deal.payout_range,
      payment_method: deal.payment_method,
      badge: deal.badge || '',
      summary: deal.summary || '',
      description: deal.description || '',
      affiliate_url: deal.affiliate_url,
      is_meta_safe: Boolean(deal.is_meta_safe),
      is_featured: Boolean(deal.is_featured),
      requirements: (deal.requirements || []).join('\n'),
      steps: (deal.steps || []).join('\n')
    });
    setTab('new');
  };

  const resetForm = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      category: 'microtasks',
      payout_range: 'Ksh 1,000 – 3,000 / day',
      payment_method: 'Direct M-Pesa',
      badge: 'Popular',
      summary: '',
      description: '',
      affiliate_url: '',
      is_meta_safe: true,
      is_featured: false,
      requirements: 'Smartphone with internet\nSafaricom M-Pesa line',
      steps: 'Sign up with verified phone\nComplete onboarding test\nReceive direct payout'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>Deal & Click Manager</span>
            {isAuthenticated && (
              <span className="text-[10px] font-bold bg-[#008744]/10 text-[#008744] border border-[#008744]/20 px-2 py-0.5 rounded-full">
                Live
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">Track visitor clicks and update deals</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <div className="p-8 max-w-md mx-auto my-auto text-center w-full">
          <p className="text-sm font-semibold text-slate-700 mb-4">Enter Admin Secret Key:</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter secret key..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#008744]"
              />
              <button
                type="submit"
                className="w-full bg-[#008744] hover:bg-[#007038] text-white font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center gap-4 px-5 pt-3 border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => { setTab('analytics'); loadData(secret); }}
                className={`flex items-center gap-1.5 text-xs font-bold pb-3 border-b-2 transition-all ${
                  tab === 'analytics'
                    ? 'border-[#008744] text-[#008744]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Live Click Tracking</span>
              </button>

              <button
                onClick={() => setTab('deals')}
                className={`flex items-center gap-1.5 text-xs font-bold pb-3 border-b-2 transition-all ${
                  tab === 'deals'
                    ? 'border-[#008744] text-[#008744]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>All Deals ({deals.length})</span>
              </button>

              <button
                onClick={() => { resetForm(); setTab('new'); }}
                className={`flex items-center gap-1.5 text-xs font-bold pb-3 border-b-2 transition-all ${
                  tab === 'new'
                    ? 'border-[#008744] text-[#008744]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</span>
              </button>

              <button
                onClick={() => loadData(secret)}
                className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-900 pb-3 flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* TAB: ANALYTICS & CLICK TRACKING */}
            {tab === 'analytics' && analytics && (
              <div className="p-5 space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">Total Link Clicks</span>
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      {analytics.summary.totalClicks}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">Unique Visitors</span>
                    <span className="text-2xl font-black text-[#008744] tabular-nums">
                      {analytics.summary.uniqueVisitors}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">Clicks Today</span>
                    <span className="text-2xl font-black text-amber-600 tabular-nums">
                      {analytics.summary.todayClicks}
                    </span>
                  </div>
                </div>

                {/* Top Deals by Conversion */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Deal Conversion Leaderboard
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="p-3">Deal Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Total Clicks</th>
                          <th className="p-3 text-right">Unique Users</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {analytics.topDeals.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{d.title}</td>
                            <td className="p-3 capitalize text-slate-500">{d.category}</td>
                            <td className="p-3 text-right font-bold text-[#008744] tabular-nums">
                              {d.tracked_clicks}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-600 tabular-nums">
                              {d.unique_users}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traffic Attribution & Devices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Traffic Attribution (Meta Ads / WhatsApp / Direct)
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                      {analytics.trafficSources.length === 0 ? (
                        <p className="text-slate-400">No clicks recorded yet.</p>
                      ) : (
                        analytics.trafficSources.map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                            <span className="capitalize font-semibold text-slate-800">{s.source_channel}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#008744] tabular-nums">{s.clicks} clicks</span>
                              <span className="text-[11px] text-slate-500 tabular-nums">({s.unique_visitors} unique)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Devices Breakdown
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                      {analytics.devices.map((dev, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                          <span className="capitalize font-semibold text-slate-800">{dev.device_type}</span>
                          <span className="font-bold text-slate-900 tabular-nums">{dev.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time Click Stream */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Live Real-Time Click Log (Last 50 Events)
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto text-[11px]">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="p-2.5">Timestamp</th>
                          <th className="p-2.5">Deal</th>
                          <th className="p-2.5">Device & Browser</th>
                          <th className="p-2.5">Source / UTM</th>
                          <th className="p-2.5">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {analytics.recentClicks.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-500">{c.created_at}</td>
                            <td className="p-2.5 font-bold text-slate-900">{c.deal_name || `Deal #${c.deal_id}`}</td>
                            <td className="p-2.5 capitalize">{c.device_type} ({c.browser})</td>
                            <td className="p-2.5">
                              <span className="font-semibold text-[#008744]">{c.utm_source || 'direct'}</span>
                              {c.utm_campaign && <span className="text-slate-500"> / {c.utm_campaign}</span>}
                            </td>
                            <td className="p-2.5 font-mono text-slate-500">{c.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEALS LIST */}
            {tab === 'deals' && (
              <div className="p-5 space-y-3">
                {deals.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{d.title}</span>
                        {d.is_meta_safe ? (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Meta Ad Safe
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                            Organic Only
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 uppercase">{d.category}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1 mb-1">{d.summary}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="text-[#008744] font-bold tabular-nums">{d.payout_range}</span>
                        <span>Total Clicks: {d.click_count || 0}</span>
                        <a href={d.affiliate_url} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium">
                          <span>Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(d)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: NEW / EDIT DEAL FORM */}
            {tab === 'new' && (
              <form onSubmit={handleSaveDeal} className="p-5 space-y-4 max-w-2xl mx-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Deal Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swahili Speech Annotation"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    >
                      <option value="microtasks">Microtasks & AI</option>
                      <option value="freelance">Freelance & Writing</option>
                      <option value="affiliate">Affiliate Partner</option>
                      <option value="surveys">Paid Surveys</option>
                      <option value="apps">Mobile Apps</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Earning Range *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ksh 1,500 – 3,500 / day"
                      value={formData.payout_range}
                      onChange={(e) => setFormData({ ...formData, payout_range: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                    <input
                      type="text"
                      placeholder="Direct M-Pesa"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Instant M-Pesa"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Affiliate / Deal URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.affiliate_url}
                    onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Short Card Summary</label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Requirements (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Steps to Join (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.steps}
                      onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#008744]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Meta Ads Safe (Review Safe)</span>
                    <span className="text-[11px] text-slate-600">
                      Enable for work, microtasks, transcription. Disable if sensitive so Facebook review bots never see it.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_meta_safe}
                    onChange={(e) => setFormData({ ...formData, is_meta_safe: e.target.checked })}
                    className="w-5 h-5 rounded text-[#008744] focus:ring-[#008744]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTab('deals')}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-[#008744] hover:bg-[#007038] text-white font-bold shadow-sm"
                  >
                    {loading ? 'Saving...' : editingDeal ? 'Update Deal' : 'Publish Deal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    );
}
