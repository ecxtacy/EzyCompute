import React from 'react';
import './TasksGrid.css';

function TasksGrid({ tasks }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks available</div>;
  }

  return (
    <div className="tasks-grid">
      {tasks.map(task => (
        <div key={task.id} className={`task-card task-${task.status}`}>
          <div className="task-header">
            <div className="task-id">Task #{task.id}</div>
            <span className={`task-status-badge status-${task.status}`}>
              {task.status}
            </span>
          </div>

          <div className="task-body">
            {task.assigned_to && (
              <div className="task-field">
                <span className="task-label">Worker:</span>
                <code className="task-value">{task.assigned_to}</code>
              </div>
            )}

            {task.worker_message && (
              <div className="task-field">
                <span className="task-label">Message:</span>
                <span className="task-value">{task.worker_message}</span>
              </div>
            )}

            {task.result && (
              <div className="task-field">
                <span className="task-label">Result:</span>
                <span className="task-value">
                  [{task.result.slice(0, 2).map(v => v.toFixed(2)).join(', ')}...]
                </span>
              </div>
            )}

            {task.requeued && (
              <div className="task-field requeued">
                <span className="task-label">Status:</span>
                <span className="task-value">Requeued / Stale</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TasksGrid;
