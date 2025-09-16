import React from 'react';

export default function ProductCard({ product, onAddToCart, isInCart }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="h-40 flex items-center justify-center mb-4">
          <img src={product.image} alt={product.title} className="max-h-36 object-contain drop-shadow-md" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2">{product.title}</h3>
        <p className="text-lg font-bold text-indigo-700 dark:text-pink-200 mt-auto">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price * 50)}
        </p>
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => onAddToCart(product)}
          className={`w-full px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-150 hover:bg-indigo-700 focus:outline-none ${
            isInCart
              ? 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:text-gray-100 dark:hover:bg-indigo-800'
          }`}
          disabled={isInCart}
        >
          {isInCart ? 'Added' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
