import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }){
  const { increaseQty, decreaseQty, removeFromCart } = useCart()
  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      <img src={item.image} alt={item.title} className="w-24 h-24 object-contain" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 border rounded">-</button>
          <div className="px-3 py-1 border rounded">{item.quantity}</div>
          <button onClick={() => increaseQty(item.id)} className="px-2 py-1 border rounded">+</button>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
        <div>
          <button onClick={() => removeFromCart(item.id)} className="text-sm px-3 py-1 border rounded bg-red-50 text-red-600">Remove</button>
        </div>
      </div>
    </div>
  )
}
