import React from 'react';
import StatsGrid from './StatsGrid';
import ClientsTable from './ClientsTable';
import TasksList from './TasksList';
import MatrixSection from './MatrixSection';
import ResultsSection from './ResultsSection';
import WorkerLog from './WorkerLog';
import TasksGrid from './TasksGrid';

export default function Dashboard({ data, loading, lastUpdate }) {
  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full"></div>
            <p className="text-slate-600 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Stats Grid */}
      <StatsGrid data={data} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        {/* Left: Matrix + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <MatrixSection tasks={data?.tasks || []} />
          <TasksList data={data} />
          <WorkerLog tasks={data?.tasks || []} />
        </div>

        {/* Right: Status + Results + Clients */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Status</h3>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Last Update</p>
                <p className="text-sm text-slate-700 mt-1">
                  {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-sm text-slate-700">Online</p>
                </div>
              </div>
            </div>
          </div>

          <ResultsSection tasks={data?.tasks || []} />
          <ClientsTable data={data} />
        </div>
      </div>
    </main>
  );
}
