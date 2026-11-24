import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminPortal from '../components/AdminPortal';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Link>
      </div>

      <AdminPortal onClose={() => window.location.href = '/'} />
    </div>
  );
}
