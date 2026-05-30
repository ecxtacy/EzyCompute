import React, { useState } from 'react';
import Card from './Card';
import './ResultsSection.css';

function ResultsSection({ tasks }) {
  const [showResults, setShowResults] = useState(false);

  const completedTasks = tasks.filter(t => t.result && t.status === 'done');

  const handleToggle = () => {
    setShowResults(!showResults);
  };

  const handleDownload = () => {
    window.location.href = '/admin/download_results';
  };

  return (
    <Card title="✅ Results">
      <div className="results-section">
        <div className="results-stats">
          <div className="results-stat">
            <span className="results-label">Completed Tasks</span>
            <span className="results-value">{completedTasks.length}</span>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={handleToggle}
          >
            {showResults ? '👁️ Hide Results' : '👁️ View Results'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDownload}
          >
            ⬇️ Download
          </button>
        </div>

        {showResults && (
          <div className="results-viewer">
            {completedTasks.length === 0 ? (
              <div className="empty-results">No completed tasks yet</div>
            ) : (
              <div className="results-grid">
                {completedTasks.map(task => (
                  <div key={task.id} className="result-item">
                    <div className="result-header">
                      <strong>Task #{task.id}</strong>
                    </div>
                    <code className="result-data">
                      {Array.isArray(task.result) 
                        ? `[${task.result.slice(0, 5).map(v => typeof v === 'number' ? v.toFixed(4) : v).join(', ')}${task.result.length > 5 ? ', ...' : ''}]`
                        : typeof task.result === 'object'
                          ? JSON.stringify(task.result)
                          : String(task.result)}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default ResultsSection;
