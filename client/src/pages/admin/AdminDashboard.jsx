import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import AdminNav from '../../components/AdminNav.jsx';
import adminService from '../../services/adminService.js';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeRate = stats?.totalUsers ? ((stats?.activeUsers / stats?.totalUsers) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            <span>{refreshing ? '⟳' : '↻'}</span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">⚠️ Error loading dashboard:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Make sure you are logged in as an admin user.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="blue"
            description="Registered users"
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon="✓"
            color="green"
            description="Currently active"
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon="📦"
            color="purple"
            description="In catalog"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon="💰"
            color="yellow"
            description="From cart orders"
          />
        </div>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Statistics Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">User Statistics</h2>
              <span className="text-2xl">👥</span>
            </div>
            <div className="space-y-3">
              <StatRow label="Admins" value={stats?.totalAdmins || 0} color="blue" />
              <StatRow label="Regular Users" value={(stats?.totalUsers || 0) - (stats?.totalAdmins || 0)} color="green" />
              <StatRow label="Inactive" value={stats?.inactiveUsers || 0} color="red" />
              <StatRow label="New this month" value={stats?.usersCreatedThisMonth || 0} color="indigo" />
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Rate</span>
                  <span className="font-bold text-green-600">{activeRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Statistics Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">System Statistics</h2>
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="space-y-3">
              <StatRow label="Total Carts" value={stats?.totalCarts || 0} color="indigo" />
              <StatRow label="Avg Revenue" value={`$${stats?.totalCarts > 0 ? (stats?.totalRevenue / stats?.totalCarts).toFixed(2) : 0}`} color="yellow" />
              <StatRow label="Products/User" value={stats?.totalUsers > 0 ? (stats?.totalProducts / stats?.totalUsers).toFixed(2) : 0} color="purple" />
              <div className="pt-3 border-t">
                <span className="text-sm text-gray-600">Dashboard Status: </span>
                <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  ✓ Online
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="space-y-2">
              <QuickActionLink href="/admin/users" label="Manage Users" icon="👥" />
              <QuickActionLink href="/admin/activity" label="View Activity Logs" icon="📋" />
              <QuickActionLink href="/" label="Back to Store" icon="🏪" />
              <QuickActionLink href="/profile" label="Your Profile" icon="👤" />
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📊 System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Key Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Total registered users: <span className="font-bold">{stats?.totalUsers || 0}</span></li>
                <li>✓ Active user percentage: <span className="font-bold">{activeRate}%</span></li>
                <li>✓ Admin accounts: <span className="font-bold">{stats?.totalAdmins || 0}</span></li>
                <li>✓ Total orders placed: <span className="font-bold">{stats?.totalCarts || 0}</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Revenue Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>💰 Total revenue: <span className="font-bold">${(stats?.totalRevenue || 0).toFixed(2)}</span></li>
                <li>💰 Average order value: <span className="font-bold">${stats?.totalCarts > 0 ? (stats?.totalRevenue / stats?.totalCarts).toFixed(2) : 0}</span></li>
                <li>📦 Total products: <span className="font-bold">{stats?.totalProducts || 0}</span></li>
                <li>📈 Products per user: <span className="font-bold">{stats?.totalUsers > 0 ? (stats?.totalProducts / stats?.totalUsers).toFixed(2) : 0}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-l-4 border-blue-500',
    green: 'bg-green-50 border-l-4 border-green-500',
    purple: 'bg-purple-50 border-l-4 border-purple-500',
    yellow: 'bg-yellow-50 border-l-4 border-yellow-500',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={`rounded-lg p-6 shadow-md hover:shadow-lg transition ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <span className={`text-4xl ${iconColorClasses[color]}`}>{icon}</span>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className={`font-bold ${colorClasses[color]}`}>{value}</span>
    </div>
  );
};

const QuickActionLink = ({ href, label, icon }) => {
  return (
    <a
      href={href}
      className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition border border-gray-200 hover:border-blue-300"
    >
      <span className="mr-2">{icon}</span>
      {label}
      <span className="float-right">→</span>
    </a>
  );
};

export default AdminDashboard;
