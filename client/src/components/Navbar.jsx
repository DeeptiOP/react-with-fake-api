import React, { useState, useEffect } from 'react';

export default function Navbar({ cartCount, onOpenCart }) {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <nav className="bg-white dark:bg-blue-950/50 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">PrinTeeQ Store</div>
            <div className="ml-4 text-sm text-gray-500 hidden sm:block">Online Shop</div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none dark:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              Cart
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-indigo-800 bg-indigo-100 rounded-full dark:text-indigo-100 dark:bg-indigo-900">
                {cartCount}
              </span>
            </button>

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
