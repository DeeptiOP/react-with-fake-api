import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import AdminNav from '../../components/AdminNav.jsx';
import adminService from '../../services/adminService.js';

const AdminActivity = () => {
  const { } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const [activityData, logsData] = await Promise.all([
        adminService.getUserActivity(),
        adminService.getSystemLogs(),
      ]);
      setActivity(activityData);
      setLogs(logsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Activity & Logs</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading activity...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Logins */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Logins</h2>
              {activity?.recentLogins && activity.recentLogins.length > 0 ? (
                <div className="space-y-4">
                  {activity.recentLogins.map((login, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <p className="font-medium text-gray-900">{login.name}</p>
                      <p className="text-sm text-gray-600">{login.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(login.lastLogin).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No login activity</p>
              )}
            </div>

            {/* Recent Signups */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Signups</h2>
              {activity?.recentSignups && activity.recentSignups.length > 0 ? (
                <div className="space-y-4">
                  {activity.recentSignups.map((signup, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <p className="font-medium text-gray-900">{signup.name}</p>
                      <p className="text-sm text-gray-600">{signup.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(signup.createdAt).toLocaleString()}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                          signup.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {signup.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No signup activity</p>
              )}
            </div>

            {/* System Logs */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">System Logs</h2>
              {logs && logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Timestamp</th>
                        <th className="px-4 py-2 text-left">Action</th>
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {logs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-gray-900">{log.action}</td>
                          <td className="px-4 py-2 text-gray-600">{log.user}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No logs available</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminActivity;
