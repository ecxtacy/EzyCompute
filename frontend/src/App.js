import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import PiEstimatorPage from './pages/PiEstimatorPage';
import './styles/index.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/admin/status');
      // Normalize backend shape: backend returns { clients: {id: {..}}, tasks: [...] }
      const rawClients = response.data.clients || {};
      const clientsArray = Object.entries(rawClients).map(([id, info]) => ({
        client_id: id,
        gpu_model: info.gpu_model,
        status: info.status,
        last_seen: info.last_seen,
      }));

      const rawTasks = Array.isArray(response.data.tasks) ? response.data.tasks : [];
      const tasks = rawTasks.map(t => ({
        task_id: t.id ?? t.task_id,
        id: t.id,
        start_row: t.start_row,
        end_row: t.end_row,
        status: t.status,
        assigned_to: t.assigned_to,
        started_at: t.started_at,
        lease_expires_at: t.lease_expires_at,
        last_heartbeat: t.last_heartbeat,
        worker_message: t.worker_message,
        requeued: t.requeued,
        result: t.result,
      }));

      const normalizedData = {
        num_clients: clientsArray.length,
        active_tasks: tasks.filter(t => t.status === 'working').length,
        completed_tasks: tasks.filter(t => t.status === 'done').length,
        total_tasks: tasks.length,
        clients: clientsArray,
        tasks,
        pi_estimate: response.data.pi_estimate,
        total_points: response.data.total_points,
        points_inside: response.data.points_inside,
      };
      setData(normalizedData);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching status:', err);
      // Set empty data structure on error
      setData({
        num_clients: 0,
        active_tasks: 0,
        completed_tasks: 0,
        total_tasks: 0,
        clients: [],
        tasks: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all tasks?')) {
      try {
        await axios.post('/admin/reset');
        await fetchStatus();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              data={data} 
              loading={loading}
              error={error}
              lastUpdate={lastUpdate}
              fetchStatus={fetchStatus}
              handleReset={handleReset}
            />
          } 
        />
        <Route 
          path="/pi-estimator" 
          element={
            <PiEstimatorPage 
              data={data} 
              loading={loading}
              error={error}
              lastUpdate={lastUpdate}
              fetchStatus={fetchStatus}
              handleReset={handleReset}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
