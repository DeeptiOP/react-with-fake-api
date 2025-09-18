import React from 'react'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/currency'

export default function ProductCard({ product }){
  const { cart, addToCart, removeFromCart } = useCart()
  const inCart = cart.some(p => p.id === product.id)

  return (
    <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5">
      <div className="h-48 w-full bg-white dark:bg-gray-700 flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-700">
        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-base leading-snug line-clamp-2 min-h-[2.75rem]">{product.title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold">{formatINR(product.price * 10)}</span>
          <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">{product.category}</span>
        </div>
        {inCart ? (
          <button
            onClick={() => removeFromCart(product.id)}
            className="mt-3 h-10 w-full rounded-lg border border-red-300 hover:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Remove from Cart
          </button>
        ) : (
          <button
            onClick={() => addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image
            })}
            className="mt-3 h-10 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm hover:shadow"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
