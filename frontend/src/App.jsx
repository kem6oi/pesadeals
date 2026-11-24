import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DealDetailPage from './pages/DealDetailPage';
import AdminPage from './pages/AdminPage';
import LegalPage from './pages/LegalPage';
import { isMetaTraffic } from './api';

export default function App() {
  const metaSafeActive = isMetaTraffic();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <Navbar isMetaMode={metaSafeActive} />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deal/:slug" element={<DealDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl mx-auto">
              PesaDeals Kenya is an informational index of verified remote work and affiliate opportunities for Kenyans. We do not charge registration fees. Outcomes vary based on individual skill and commitment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
              <Link to="/legal/disclaimer" className="hover:text-[#008744] transition-colors">
                Earnings Disclaimer
              </Link>
              <Link to="/legal/privacy" className="hover:text-[#008744] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="hover:text-[#008744] transition-colors">
                Terms of Service
              </Link>
              <Link to="/legal/contact" className="hover:text-[#008744] transition-colors">
                Contact Us
              </Link>
            </div>

            <p className="text-[10px] text-slate-400 pt-1">
              © {new Date().getFullYear()} PesaDeals Kenya. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
