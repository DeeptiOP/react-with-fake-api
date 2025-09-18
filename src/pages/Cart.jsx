import React from 'react'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import { formatINR } from '../utils/currency'

export default function CartPage(){
  const { cart, getCartTotals } = useCart()
  const { subtotal, discount, total } = getCartTotals()

  if(cart.length === 0) return <div>
    <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
    <p>Your cart is empty. Go add some products!</p>
  </div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
        <div className="space-y-4">
          {cart.map(item => <CartItem key={item.id} item={item} />)}
        </div>
      </div>

      <aside className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatINR(subtotal * 10)}</span>
        </div>
        <div className="flex justify-between">
          <span>10% Discount</span>
          <span>-{formatINR(discount * 10)}</span>
        </div>
        <hr className="my-3 border-gray-200 dark:border-gray-700" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatINR(total * 10)}</span>
        </div>
      </aside>
    </div>
  )
}
