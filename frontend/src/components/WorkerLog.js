import React from 'react';
import './WorkerLog.css';

function WorkerLog({ tasks }) {
  const formatTime = (isoString) => {
    if (!isoString) return '??:??:??';
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  const messages = tasks
    .filter(t => t.worker_message)
    .slice(-10)
    .map(t => ({
      taskId: t.id,
      message: t.worker_message,
      time: t.last_heartbeat,
      status: t.status
    }));

  return (
    <div className="worker-log">
      {messages.length === 0 ? (
        <div className="empty-log">Waiting for worker updates...</div>
      ) : (
        <div className="log-entries">
          {messages.reverse().map((msg, idx) => (
            <div key={idx} className="log-entry">
              <div className="log-header">
                <span className="log-time">{formatTime(msg.time)}</span>
                <span className={`log-task task-${msg.status}`}>Task #{msg.taskId}</span>
              </div>
              <div className="log-message">{msg.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkerLog;
