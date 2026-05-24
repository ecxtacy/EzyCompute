import React from 'react';

export default function ClientsTable({ data }) {
  // Ensure clients is always an array
  const clients = Array.isArray(data?.clients) ? data.clients : [];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Connected Clients</h3>
        <p className="card-subtitle">{clients.length} client{clients.length !== 1 ? 's' : ''} online</p>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-2xl">
          <p className="text-slate-500">No clients connected</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="table-header text-left py-4 px-4">Client ID</th>
                <th className="table-header text-left py-4 px-4">Address</th>
                <th className="table-header text-left py-4 px-4">Status</th>
                <th className="table-header text-left py-4 px-4">Tasks</th>
                <th className="table-header text-left py-4 px-4">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.client_id} className="table-row">
                  <td className="py-4 px-4">
                    <span className="font-medium text-slate-900">{client.client_id}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {client.gpu_model || '-'}
                      </code>
                    </td>
                  <td className="py-4 px-4">
                    <span className={`status-badge status-${client.status?.toLowerCase() || 'pending'}`}>
                      {client.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {client.completed_tasks || 0}
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-sm">
                    {client.last_seen ? new Date(client.last_seen).toLocaleTimeString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
