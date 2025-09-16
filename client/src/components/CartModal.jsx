import React, { useEffect } from 'react';

export default function CartModal({ isOpen, onClose, cartItems, onRemove }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/70" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-11/12 max-w-3xl mx-auto z-10">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-gray-100">
            Your Cart ({cartItems.length})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            Close
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No items in the cart.</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((it) => (
                <li key={it.id} className="flex items-center space-x-4 border rounded p-3 dark:border-gray-800 dark:bg-gray-800">
                  <img src={it.image} alt={it.title} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{it.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">${it.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => onRemove(it.id)}
                      className="px-3 py-1 rounded-md border text-sm bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
