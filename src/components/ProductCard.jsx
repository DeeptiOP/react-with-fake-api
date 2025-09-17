import React from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }){
  const { cart, addToCart, removeFromCart } = useCart()
  const inCart = cart.some(p => p.id === product.id)

  return (
    <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
      <img src={product.image} alt={product.title} className="h-48 object-contain mb-4" />
      <h3 className="font-medium text-lg mb-1">{product.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3 mb-2">{product.description}</p>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.category}</span>
        </div>
        <button
          onClick={() => addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
          })}
          className={`w-full px-4 py-2 rounded ${inCart ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}
        >
          {inCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
