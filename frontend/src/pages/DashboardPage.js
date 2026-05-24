import React from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { Link } from 'react-router-dom';

export default function DashboardPage({ data, loading, error, lastUpdate, fetchStatus, handleReset }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-primary-50">
      <Header onRefresh={fetchStatus} onReset={handleReset} />
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link to="/" className="text-primary-600 hover:text-primary-800 text-sm font-medium inline-flex items-center gap-1 mb-2 transition-colors">
          &larr; Back to Home
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 px-6 py-3 rounded-md mx-6 mb-4 max-w-7xl lg:mx-auto">
          {error}
        </div>
      )}
      <Dashboard 
        data={data} 
        loading={loading}
        lastUpdate={lastUpdate}
      />
    </div>
  );
}