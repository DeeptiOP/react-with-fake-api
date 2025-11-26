import React from 'react';

export default function FeaturedProductCard({ product, onAddToCart, isInCart, onToggleWishlist, isInWishlist }) {
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full border border-gray-200 dark:border-gray-700">
      {/* Top Badge */}
      <div className="absolute top-3 right-3 z-20">
        <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Featured
        </span>
      </div>

      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-40 object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 min-h-10">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating.count})</span>
          </div>
        )}

        {/* Price */}
        <p className="text-xl font-bold text-indigo-700 dark:text-pink-300 mt-auto mb-3">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price * 50)}
        </p>
      </div>

      {/* Actions */}
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
            isInCart
              ? 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
          }`}
          disabled={isInCart}
        >
          {isInCart ? '✓ Added' : 'Add'}
        </button>

        <button
          onClick={() => onToggleWishlist && onToggleWishlist(product)}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
            isInWishlist
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? '♥' : '♡'}
        </button>
      </div>
    </div>
  );
}
