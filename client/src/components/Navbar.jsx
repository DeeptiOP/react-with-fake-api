import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ cartCount, onOpenCart, wishlistCount = 0 }) {
  const [isDark, setIsDark] = useState(false);
  const { authenticated, user, logout, isAdmin } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setIsDark(document.body.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function toggleDarkMode() {
    document.body.classList.toggle('dark');
    setIsDark(document.body.classList.contains('dark'));
  }

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  return (
    <nav className="bg-white dark:bg-blue-950/50 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              PrinTeeQ Store
            </Link>
            <div className="ml-4 text-sm text-gray-500 hidden sm:block">Online Shop</div>
          </div>

          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenCart}
                    className="relative inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Cart
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-indigo-800 bg-indigo-100 rounded-full dark:text-indigo-100 dark:bg-indigo-900">
                      {cartCount}
                    </span>
                  </button>

                  <Link
                    to="/profile"
                    className="relative inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-gray-800 bg-yellow-100 hover:bg-yellow-200"
                    aria-label="Wishlist"
                  >
                    ♡ Wish
                    {typeof wishlistCount === 'number' && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-yellow-800 bg-yellow-200 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                  >
                    Admin
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <span>{user?.name}</span>
                    <span>▼</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b">
                        {user?.email}
                      </div>
                      <Link to="/profile" onClick={() => setShowMenu(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Register
                </Link>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 border hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              type="button"
              aria-label="Toggle dark mode"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
