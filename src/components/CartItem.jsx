import React from 'react'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/currency'

export default function CartItem({ item }){
  const { increaseQty, decreaseQty, removeFromCart } = useCart()
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex gap-4">
      <img src={item.image} alt={item.title} className="w-24 h-24 object-contain" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{formatINR(item.price * 10)} each</p>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 transition-colors">-</button>
          <div className="px-3 py-1 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">{item.quantity}</div>
          <button onClick={() => increaseQty(item.id)} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 transition-colors">+</button>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="font-semibold">{formatINR(item.price * 10 * item.quantity)}</div>
        <div>
          <button onClick={() => removeFromCart(item.id)} className="text-sm px-3 py-1 border rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">Remove</button>
        </div>
      </div>
    </div>
  )
}
