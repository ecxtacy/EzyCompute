import React from 'react';

export default function TasksList({ data }) {
  // Ensure tasks is always an array
  const tasks = Array.isArray(data?.tasks) ? data.tasks : [];


  if (tasks.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Active Tasks</h3>
        </div>
        <div className="text-center py-2xl">
          <p className="text-slate-500">No active tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Active Tasks</h3>
        <p className="card-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.task_id}
            className={`border border-slate-200 rounded-md p-4 hover:bg-slate-50 transition-colors ${
              task.status === 'working' ? 'task-working' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{task.computation_type || 'Task'}</p>
                <p className="text-xs text-slate-500 mt-1">ID: {task.task_id}</p>
              </div>
              <span className={`status-badge status-${task.status?.toLowerCase() || 'pending'}`}>
                {task.status || 'PENDING'}
              </span>
            </div>
            
            {task.progress !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">Progress</span>
                  <span className="text-xs font-medium text-slate-700">{Math.round(task.progress || 0)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
              </div>
            )}
            
            {task.num_workers && (
              <p className="text-xs text-slate-500 mt-4">
                Using {task.num_workers} worker{task.num_workers !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
