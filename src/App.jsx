import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Products from './pages/Products'
import CartPage from './pages/Cart'
import { useCart } from './context/CartContext'
import ThemeToggle from './components/ThemeToggle'


function App() {
  const { cart } = useCart()
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0)
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 border-b border-gray-300 dark:border-gray-700 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">FakeStore</Link>
          <nav className="space-x-2 flex items-center">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">Products</Link>
            <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
              Cart ({totalItems})
            </Link>
            <ThemeToggle />
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
  );
}

export default App;
