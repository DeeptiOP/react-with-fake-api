import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let aborted = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (!aborted) setProducts(data);
      } catch (err) {
        if (!aborted) setError(err.message || 'Error');
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    fetchProducts();
    return () => { aborted = true; };
  }, []);

  function handleAddToCart(product) {
    const exists = cart.find((c) => c.id === product.id);
    if (exists) {
      window.alert('Item already added to the cart');
      return;
    }
    setCart((prev) => [...prev, product]);
  }

  function handleRemoveFromCart(productId) {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Products</h1>
        </header>

        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  isInCart={!!cart.find((c) => c.id === p.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemove={handleRemoveFromCart} />

      <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
        Built with React + Tailwind • Fake Store API
      </footer>
    </div>
  );
}
