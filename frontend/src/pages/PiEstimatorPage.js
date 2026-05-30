import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function PiEstimatorPage({ data, loading, error, lastUpdate, fetchStatus, handleReset }) {
  const pi = data?.pi_estimate || 0;
  const total = data?.total_points || 0;
  const inside = data?.points_inside || 0;
  
  const stats = [
    {
      label: 'Current Pi Estimate',
      value: pi ? Number(pi).toFixed(6) : '0.000000',
      icon: '📐',
      color: 'bg-indigo-100 text-indigo-700',
      border: 'border-b-4 border-indigo-500'
    },
    {
      label: 'Points Inside Circle',
      value: inside.toLocaleString(),
      icon: '🎯',
      color: 'bg-emerald-100 text-emerald-700',
      border: 'border-b-4 border-emerald-500'
    },
    {
      label: 'Total Samples Processed',
      value: total.toLocaleString(),
      icon: '📊',
      color: 'bg-blue-100 text-blue-700',
      border: 'border-b-4 border-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-primary-50">
      <Header onRefresh={fetchStatus} onReset={handleReset} />
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">
        <Link to="/" className="text-primary-600 hover:text-primary-800 text-sm font-medium inline-flex items-center gap-1 mb-2 transition-colors">
          &larr; Back to Home
        </Link>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-800 text-sm font-medium inline-flex items-center gap-1 mb-2 transition-colors">
          📊 System Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 px-6 py-3 rounded-md mx-6 mb-4 max-w-7xl lg:mx-auto">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full"></div>
              <p className="text-slate-600 mt-4">Loading pi estimator...</p>
            </div>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Distributed Monte Carlo π Estimation</h2>
            <p className="mt-3 max-w-2xl mx-auto text-slate-600">
              This estimator showcases the distributed computing capability. Millions of random coordinates 
              are generated across the system's worker nodes. By calculating how many land inside a unit circle,
              the cluster continually refines an approximation of π.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${stat.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${stat.color} text-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-500 font-medium text-sm tracking-wide uppercase">{stat.label}</h3>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Computation Details</h3>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Real-time
              </span>
            </div>
            <div className="p-6 text-slate-700 bg-slate-50 leading-relaxed space-y-4">
              <p>
                <strong>Method:</strong> The framework assigns "tasks" to worker compute nodes. Each task involves generating many random Cartesian coordinates <code>(x, y)</code> within the unit square <code>[0, 1] &times; [0, 1]</code>.
              </p>
              <p>
                <strong>Math:</strong> If <code>x&sup2; + y&sup2; &le; 1</code>, the point falls inside the quarter-circle. The probability of landing in the quarter-circle is <code>&pi; / 4</code>. Therefore, <code>&pi; &approx; 4 &times; (Points Inside / Total Points)</code>.
              </p>
              <p>
                <strong>Scalability:</strong> With this multi-node framework, nodes process their workloads independently and push aggregated metrics back to the server, which combines the sums to drastically improve precision through high-scale processing!
              </p>

              <div className="mt-6 flex justify-center items-center opacity-80">
                <div className="w-48 h-48 rounded-md bg-white border border-slate-300 relative flex items-center justify-center shadow-inner overflow-hidden">
                   <div className="absolute border-2 border-indigo-300 bg-indigo-100/50 w-96 h-96 rounded-full -top-48 -left-48 pointer-events-none"></div>
                   <span className="text-indigo-800 font-bold z-10 text-xl pointer-events-none drop-shadow-md">π</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
