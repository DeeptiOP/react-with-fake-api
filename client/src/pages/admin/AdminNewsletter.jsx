import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSubscribers() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const apiBase = import.meta.env.VITE_API_URL || 'https://react-with-fake-api.onrender.com/api';
        const res = await fetch(`${apiBase}/newsletter`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized');
          throw new Error('Failed to fetch subscribers');
        }
        const data = await res.json();
        if (mounted) setSubscribers(data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Error loading subscribers');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchSubscribers();
    return () => { mounted = false; };
  }, []);

  const handleExportCSV = () => {
    const csv = subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleString()},${s.source || 'unknown'}`).join('\n');
    const header = 'email,subscribedAt,source\n';
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            📥 Export CSV
          </button>
        </div>

        {loading && <div className="text-center py-10 text-gray-500">Loading subscribers...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Subscribed</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No subscribers yet</td>
                  </tr>
                ) : (
                  subscribers.map((s, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{s.email}</td>
                      <td className="px-4 py-3 text-sm">{new Date(s.subscribedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{s.source || 'unknown'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          Total: <span className="font-bold">{subscribers.length}</span> subscriber{subscribers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
