import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import LoginPage from './LoginPage';
import AdminPortal from '../components/AdminPortal';
import { API_BASE } from '../api';

export default function AdminPage() {
  const [token, setToken] = useState(
    localStorage.getItem('pesadeals_admin_token') || localStorage.getItem('pesadeals_admin_key') || ''
  );
  const [username, setUsername] = useState(localStorage.getItem('pesadeals_admin_user') || 'admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

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

  const handleLoginSuccess = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('pesadeals_admin_token');
    localStorage.removeItem('pesadeals_admin_key');
    localStorage.removeItem('pesadeals_admin_user');
    setToken('');
    setIsAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#008744]" />
            <span>Admin: <strong className="text-slate-900 capitalize">{username}</strong></span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <AdminPortal authToken={token} onLogout={handleLogout} />
    </div>
  );
}
