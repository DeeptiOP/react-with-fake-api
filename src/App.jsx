import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Products from './pages/Products'
import CartPage from './pages/Cart'
import { useCart } from './context/CartContext'

export default function App(){
  const { cart } = useCart()
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0)
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">FakeStore</Link>
          <nav className="space-x-4">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200">Products</Link>
            <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-200">
              Cart ({totalItems})
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  )
}
