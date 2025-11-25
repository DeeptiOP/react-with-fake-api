import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminNav() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin/dashboard" className="text-xl font-bold hover:text-purple-200">
              🛡️ Admin Panel
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/admin/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition"
              >
                Users
              </Link>
              <Link
                to="/admin/activity"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition"
              >
                Activity
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin: <span className="font-semibold">{user?.name}</span></span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition"
              >
                ⋯
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Back to Store
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
