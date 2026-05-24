import React, { useState, useEffect } from 'react';
import '../styles/dashboard-ui.css';

/**
 * Modern SaaS Dashboard Component
 * Demonstrates all CSS classes and patterns from dashboard-ui.css
 * 
 * Features:
 * - Gradient background with animated overlays
 * - Responsive stats grid
 * - Matrix configuration panel
 * - Results panel
 * - Active tasks display
 * - Client table
 * - Status badges
 * - Modern buttons with hover effects
 */
const ModernDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 1234,
    activeTasks: 45,
    completedTasks: 892,
    systemUptime: '99.8%'
  });

  const [tasks, setTasks] = useState([
    {
      id: 'TASK-001',
      title: 'Matrix Multiplication',
      description: 'Computing 1000x1000 matrix multiplication across 12 workers',
      progress: 65,
      status: 'working',
      clients: 12
    },
    {
      id: 'TASK-002',
      title: 'Data Processing',
      description: 'Processing batch computation request from client CLN-005',
      progress: 32,
      status: 'working',
      clients: 8
    },
    {
      id: 'TASK-003',
      title: 'Verification Task',
      description: 'Verifying results from completed computation',
      progress: 100,
      status: 'completed',
      clients: 5
    }
  ]);

  const [clients, setClients] = useState([
    {
      id: 'CLN-001',
      address: '192.168.1.100:5000',
      status: 'working',
      tasksCompleted: 12,
      lastSeen: '2 mins ago'
    },
    {
      id: 'CLN-002',
      address: '192.168.1.105:5001',
      status: 'working',
      tasksCompleted: 8,
      lastSeen: '1 min ago'
    },
    {
      id: 'CLN-003',
      address: '192.168.1.110:5002',
      status: 'pending',
      tasksCompleted: 5,
      lastSeen: '5 mins ago'
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div className="dashboard-header-title">
          <h1>Dashboard</h1>
          <p>Monitor your distributed computation system</p>
        </div>
        <div className="dashboard-header-controls">
          <button 
            className="refresh-button"
            onClick={handleRefresh}
            title="Refresh data"
          >
            <span className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>
              🔄
            </span>
          </button>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-label">Connected Clients</div>
          <div className="stat-card-value">{stats.totalClients}</div>
          <div className="stat-card-change positive">
            ↑ 124 new clients
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">⚡</div>
          <div className="stat-card-label">Active Tasks</div>
          <div className="stat-card-value">{stats.activeTasks}</div>
          <div className="stat-card-change positive">
            ↑ 8 tasks running
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-label">Completed Tasks</div>
          <div className="stat-card-value">{stats.completedTasks}</div>
          <div className="stat-card-change positive">
            ↑ 12% success rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">🔧</div>
          <div className="stat-card-label">System Uptime</div>
          <div className="stat-card-value">{stats.systemUptime}</div>
          <div className="stat-card-change negative">
            ↓ 0.2% from target
          </div>
        </div>
      </div>

      {/* ===== CONFIGURATION PANELS ===== */}
      <div className="panels-grid">
        {/* Matrix Configuration Panel */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <div className="panel-card-title">📊 Matrix Configuration</div>
              <div className="panel-card-subtitle">Set parameters for distributed computation</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Matrix Size</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g., 1000"
              defaultValue="1000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Workers</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g., 8"
              defaultValue="8"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Computation Type</label>
            <select className="form-select">
              <option>Matrix Multiplication</option>
              <option>Matrix Transpose</option>
              <option>Matrix Inversion</option>
              <option>Determinant Calculation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea 
              className="form-textarea" 
              placeholder="Add any special parameters or notes..."
            />
          </div>

          <button className="gradient-button">
            Start Computation
          </button>
        </div>

        {/* Results Panel */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <div className="panel-card-title">📈 Results</div>
              <div className="panel-card-subtitle">Last computation output</div>
            </div>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '12px',
            fontFamily: 'Monaco, monospace',
            fontSize: '12px',
            color: '#6366f1',
            marginBottom: '16px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <pre style={{ margin: 0 }}>{`[
  [0.524, 0.831, 0.492],
  [0.721, 0.384, 0.619],
  [0.163, 0.927, 0.741]
]

Computation Time: 2.34s
Workers Used: 8
Status: COMPLETED`}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="gradient-button secondary">
              Export Results
            </button>
            <button className="gradient-button outline">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* ===== ACTIVE TASKS ===== */}
      <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        ⚙️ Active Tasks
      </h2>
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-card-header">
              <div className="task-card-title">{task.title}</div>
              <div className="task-card-id">{task.id}</div>
            </div>

            <div className="task-card-description">
              {task.description}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderTop: '1px solid rgba(226, 232, 240, 0.3)',
              marginTop: '12px'
            }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {task.clients} workers
              </div>
              <span className={getStatusBadgeClass(task.status)}>
                {task.status.toUpperCase()}
              </span>
            </div>

            <div className="task-card-footer">
              <div className="task-progress">
                <div className="task-progress-bar">
                  <div 
                    className="task-progress-fill" 
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <div className="task-progress-text">{task.progress}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CONNECTED CLIENTS TABLE ===== */}
      <h2 style={{ marginBottom: '24px', marginTop: '48px', fontSize: '20px', fontWeight: '600' }}>
        📡 Connected Clients
      </h2>
      <div className="table-container">
        <table className="client-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Address</th>
              <th>Status</th>
              <th>Tasks Completed</th>
              <th>Last Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="client-table-id">{client.id}</td>
                <td className="client-table-address">{client.address}</td>
                <td>
                  <span className={getStatusBadgeClass(client.status)}>
                    {client.status.toUpperCase()}
                  </span>
                </td>
                <td>{client.tasksCompleted}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{client.lastSeen}</td>
                <td className="client-table-actions">
                  <button className="table-action-btn">View Logs</button>
                  <button className="table-action-btn">Metrics</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== REFRESH INDICATOR ===== */}
      {isRefreshing && (
        <div style={{ 
          marginTop: '48px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div className="refresh-indicator loading">
            <span className="refresh-indicator-dot"></span>
            <span className="refresh-indicator-dot"></span>
            <span className="refresh-indicator-dot"></span>
            <span>Updating dashboard...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDashboard;
