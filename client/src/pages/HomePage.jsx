import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import userService from '../services/userService';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { authenticated } = useAuth();

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

  // load wishlist when authenticated
  useEffect(() => {
    let cancelled = false;
    const loadWishlist = async () => {
      if (!authenticated) return setWishlist([]);
      try {
        const wl = await userService.getWishlist();
        if (!cancelled) setWishlist(wl || []);
      } catch (err) {
        console.error('Failed to load wishlist', err);
      }
    };
    loadWishlist();
    return () => { cancelled = true; };
  }, [authenticated]);

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

  // Wishlist helpers (toggle)
  async function toggleWishlist(product) {
    if (!authenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      const exists = wishlist.some((w) => (w.externalId && w.externalId === product.id) || (w.productId && w.productId.toString() === product.id));
      if (exists) {
        const wl = await userService.removeFromWishlist(product.id);
        setWishlist(wl || []);
      } else {
        const wl = await userService.addToWishlist({ externalId: product.id, title: product.title, price: product.price, image: product.image });
        setWishlist(wl || []);
      }
    } catch (err) {
      console.error('Wishlist error', err);
      alert(err.message || 'Could not update wishlist');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} wishlistCount={wishlist.length} />

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
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={!!wishlist.find((w) => (w.externalId && w.externalId === p.id) || (w.productId && w.productId.toString() === p.id))}
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

export default HomePage;
