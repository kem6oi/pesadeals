import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, BarChart3, ListOrdered, Shield, Smartphone, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { API_BASE } from '../api';

export default function AdminPortal({ onClose }) {
  const [secret, setSecret] = useState(localStorage.getItem('pesadeals_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tab, setTab] = useState('analytics'); // 'analytics' | 'deals' | 'new'
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [deals, setDeals] = useState([]);
  const [editingDeal, setEditingDeal] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'microtasks',
    payout_range: '',
    payment_method: 'M-Pesa',
    badge: 'Popular',
    summary: '',
    description: '',
    affiliate_url: '',
    is_meta_safe: true,
    is_featured: false,
    requirements: 'Smartphone\nBasic English',
    steps: 'Sign up\nComplete profile\nReceive payout'
  });

  const checkAuth = async (keyToTest) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: keyToTest })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('pesadeals_admin_key', keyToTest);
        loadData(keyToTest);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (secret) {
      checkAuth(secret);
    }
  }, []);

  const loadData = async (key) => {
    setLoading(true);
    const authHeader = { 'X-Admin-Key': key || secret };
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

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': secret
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingDeal(null);
        setTab('deals');
        resetForm();
        loadData(secret);
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
      await fetch(`${API_BASE}/api/admin/deals/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': secret }
      });
      loadData(secret);
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
      payout_range: '',
      payment_method: 'M-Pesa',
      badge: 'Popular',
      summary: '',
      description: '',
      affiliate_url: '',
      is_meta_safe: true,
      is_featured: false,
      requirements: 'Smartphone\nBasic English',
      steps: 'Sign up\nComplete profile\nReceive payout'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Victor's Deal & Traffic Control</span>
              {isAuthenticated && (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  Connected
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Manage affiliate links and track every user click</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="p-6 max-w-md mx-auto my-auto text-center w-full">
            <p className="text-sm text-slate-300 mb-4">Enter Victor's Admin Secret Key to proceed:</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter secret key..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/50">
              <button
                onClick={() => { setTab('analytics'); loadData(secret); }}
                className={`flex items-center gap-1.5 text-xs font-medium pb-3 border-b-2 transition-all ${
                  tab === 'analytics'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Click Tracking & Traffic</span>
              </button>

              <button
                onClick={() => setTab('deals')}
                className={`flex items-center gap-1.5 text-xs font-medium pb-3 border-b-2 transition-all ${
                  tab === 'deals'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Active Deals ({deals.length})</span>
              </button>

              <button
                onClick={() => { resetForm(); setTab('new'); }}
                className={`flex items-center gap-1.5 text-xs font-medium pb-3 border-b-2 transition-all ${
                  tab === 'new'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingDeal ? 'Edit Deal' : 'Post New Deal'}</span>
              </button>

              <button
                onClick={() => loadData(secret)}
                className="ml-auto text-xs text-slate-400 hover:text-white pb-3 flex items-center gap-1"
                title="Refresh Data"
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
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Total Link Clicks</span>
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {analytics.summary.totalClicks}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Unique Visitors</span>
                    <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                      {analytics.summary.uniqueVisitors}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Clicks Today</span>
                    <span className="text-2xl font-bold text-cyan-400 tabular-nums">
                      {analytics.summary.todayClicks}
                    </span>
                  </div>
                </div>

                {/* Top Deals by Conversion */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Deal Performance & Click Volume
                  </h3>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Deal Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Total Clicks</th>
                          <th className="p-3 text-right">Unique Users</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {analytics.topDeals.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-900/30">
                            <td className="p-3 font-medium text-white">{d.title}</td>
                            <td className="p-3 capitalize text-slate-400">{d.category}</td>
                            <td className="p-3 text-right font-bold text-emerald-400 tabular-nums">
                              {d.tracked_clicks}
                            </td>
                            <td className="p-3 text-right text-slate-300 tabular-nums">
                              {d.unique_users}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traffic Source & Device Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Traffic Sources */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Traffic Attribution (Meta Ads / Social)
                    </h3>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
                      {analytics.trafficSources.length === 0 ? (
                        <p className="text-slate-500">No clicks tracked yet.</p>
                      ) : (
                        analytics.trafficSources.map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                            <span className="capitalize font-medium text-slate-300">{s.source_channel}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white tabular-nums">{s.clicks} clicks</span>
                              <span className="text-[11px] text-slate-500 tabular-nums">({s.unique_visitors} unique)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Device breakdown */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Devices Used
                    </h3>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
                      {analytics.devices.map((dev, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                          <span className="capitalize font-medium text-slate-300">{dev.device_type}</span>
                          <span className="font-bold text-emerald-400 tabular-nums">{dev.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time Click Stream */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Recent Click Log (Live Feed)
                  </h3>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[11px]">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Time</th>
                          <th className="p-2.5">Deal</th>
                          <th className="p-2.5">Device</th>
                          <th className="p-2.5">Source / UTM</th>
                          <th className="p-2.5">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300">
                        {analytics.recentClicks.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/20">
                            <td className="p-2.5 text-slate-400">{c.created_at}</td>
                            <td className="p-2.5 font-medium text-white">{c.deal_name || `Deal #${c.deal_id}`}</td>
                            <td className="p-2.5 capitalize">{c.device_type} ({c.browser})</td>
                            <td className="p-2.5">
                              <span className="text-emerald-400">{c.utm_source || 'direct'}</span>
                              {c.utm_campaign && <span className="text-slate-500"> / {c.utm_campaign}</span>}
                            </td>
                            <td className="p-2.5 text-slate-400 font-mono">{c.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEALS MANAGEMENT */}
            {tab === 'deals' && (
              <div className="p-5 space-y-3">
                {deals.map((d) => (
                  <div
                    key={d.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{d.title}</span>
                        {d.is_meta_safe ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                            Meta Ad Safe
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800/40 px-1.5 py-0.5 rounded">
                            Organic / Gated Only
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 uppercase">{d.category}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-1 mb-1">{d.summary}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="text-emerald-400 font-medium tabular-nums">{d.payout_range}</span>
                        <span>Clicks: {d.click_count || 0}</span>
                        <a href={d.affiliate_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                          <span>Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(d)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
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
                    <label className="block text-slate-300 font-medium mb-1">Deal Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swahili Transcription Gigs"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="microtasks">Microtasks</option>
                      <option value="freelance">Freelance</option>
                      <option value="affiliate">Affiliate Partner</option>
                      <option value="surveys">Paid Surveys</option>
                      <option value="apps">Mobile Apps</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Est. Payout Range *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KES 800 - 2,500 / day"
                      value={formData.payout_range}
                      onChange={(e) => setFormData({ ...formData, payout_range: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                    <input
                      type="text"
                      placeholder="M-Pesa / Airtm / Bank"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Instant M-Pesa"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Affiliate / Registration Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.affiliate_url}
                    onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Short Summary (1-2 sentences)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description visible on the card feed..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Full overview of the deal and instructions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Requirements (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Steps to Join (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.steps}
                      onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Meta Ads Safety Toggle */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Meta Ads Compliant (Landing Safe)</span>
                      <span className="text-[11px] text-slate-400">
                        Keep enabled for work, microtasks, surveys. Disable if offer involves restricted dating/betting so Meta bots never see it.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_meta_safe}
                      onChange={(e) => setFormData({ ...formData, is_meta_safe: e.target.checked })}
                      className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTab('deals')}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow"
                  >
                    {loading ? 'Saving...' : editingDeal ? 'Update Deal' : 'Publish Deal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
