import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-primary-50">
      <header className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 border-b border-primary-700 shadow-md">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="text-primary-300">⚡</span> EzyCompute
              </h1>
              <p className="text-sm text-primary-200 mt-1 font-medium">Distributed Computing Framework</p>
            </div>
            
            <Link 
              to="/dashboard"
              className="btn bg-white text-primary-900 hover:bg-primary-50 active:bg-primary-100 font-semibold shadow-sm transition-all"
            >
              Launch Dashboard &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slideUp">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Zero-Setup <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Distributed Task Sharding</span>
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            A minimalist master-worker framework designed to demonstrate task sharding, client polling, and real-time state visualization using Python and FastAPI.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="btn px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Open Dashboard
            </Link>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-lg rounded-full shadow-sm hover:shadow-md transition-all"
            >
              View Documentation
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <div className="card border-t-4 border-t-blue-500 animate-slideUp" style={{animationDelay: '100ms'}}>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-6 shadow-sm">
              🧠
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Orchestrator Server</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              FastAPI-backed central brain tracks a high-level master task segmented into discrete operational chunks. High performance, zero boilerplate, and native JSON serialization.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card border-t-4 border-t-amber-500 animate-slideUp" style={{animationDelay: '200ms'}}>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-sm">
              💪
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Client Workers</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Lightweight python scripts that act as the muscle. They handshake with the orchestrator, process shards (with GPU acceleration if PyTorch is found), and submit results via continuous polling loops.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card border-t-4 border-t-emerald-500 animate-slideUp" style={{animationDelay: '300ms'}}>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-6 shadow-sm">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Telemetry</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Node observability and grid serialization map block operations. Watch pending (gray), working (yellow), and computed (green) tasks live directly in the dashboard UI.
            </p>
          </div>
        </div>

        {/* Architecture snippet */}
        <div className="mt-16 card overflow-hidden p-0 max-w-4xl mx-auto shadow-xl border-slate-200 animate-slideUp" style={{animationDelay: '400ms'}}>
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="ml-4 text-xs font-mono text-slate-400">launch_workers.py</div>
          </div>
          <div className="p-6 bg-[#0f172a] overflow-x-auto">
            <pre className="text-sm font-mono text-slate-300 leading-relaxed">
              <code>
<span className="text-slate-500"># Launch 5 workers</span><br/>
<span className="text-emerald-400">python</span> launch_workers.py 5<br/>
<br/>
<span className="text-slate-500"># Launch 10 workers with verbose startup messages</span><br/>
<span className="text-emerald-400">python</span> launch_workers.py 10 --verbose<br/>
<br/>
<span className="text-slate-500"># Start orchestrator</span><br/>
<span className="text-emerald-400">python</span> main.py
              </code>
            </pre>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            EzyCompute Distributed Framework Demo
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Status: Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
