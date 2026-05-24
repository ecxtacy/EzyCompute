import React from 'react';

export default function StatsGrid({ data }) {
  // Ensure data has default values
  const safeData = {
    num_clients: data?.num_clients || 0,
    active_tasks: data?.active_tasks || 0,
    completed_tasks: data?.completed_tasks || 0,
    total_tasks: data?.total_tasks || 0,
    ...data
  };
  const stats = [
    {
      label: 'Clients',
      value: safeData.num_clients,
      icon: '👥',
      color: 'bg-blue-100 text-blue-700',
      border: 'border-b-4 border-blue-500'
    },
    {
      label: 'Active Tasks',
      value: safeData.active_tasks,
      icon: '⚡',
      color: 'bg-amber-100 text-amber-700',
      border: 'border-b-4 border-amber-500'
    },
    {
      label: 'Completed',
      value: safeData.completed_tasks,
      icon: '✅',
      color: 'bg-emerald-100 text-emerald-700',
      border: 'border-b-4 border-emerald-500'
    },
    {
      label: 'Total Tasks',
      value: safeData.total_tasks,
      icon: '📊',
      color: 'bg-purple-100 text-purple-700',
      border: 'border-b-4 border-purple-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className={`stat-card animate-slideUp transform transition-all hover:-translate-y-1 hover:shadow-lg ${stat.border}`}>
          <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
            {stat.icon}
          </div>
          <p className="stat-label mb-1">{stat.label}</p>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
