import React from 'react';

export default function Header({ onRefresh, onReset }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <header className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 border-b border-primary-700 shadow-md">
      <div className="px-6 py-5 max-w-7xl mx-auto items-center">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-primary-300">⚡</span> EzyCompute
            </h1>
            <p className="text-sm text-primary-200 mt-1 font-medium">Distributed Task Manager</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className={refreshing ? 'animate-spin inline-block' : ''}>
                🔄
              </span>
              <span className="ml-2 font-medium">{refreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
            
            <button
              onClick={onReset}
              className="btn bg-red-500/80 hover:bg-red-500 text-white border border-red-400/50 backdrop-blur-sm transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
