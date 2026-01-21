import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';
import userService from '../services/userService';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heroImages, setHeroImages] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const featuredSliderRef = useRef(null);
  const { authenticated } = useAuth();

  useEffect(() => {
    let aborted = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('https://dummyjson.com/products?limit=0');
        if (!res.ok) throw new Error('Failed to fetch products');
        const json = await res.json();
        const data = json.products || [];
        if (!aborted) {
          setProducts(data);
          if (data && data.length > 0) {
            // take up to first 5 images for the hero slideshow
            setHeroImages(data.slice(0, 5).map((p) => p.thumbnail));
            setHeroIndex(0);
          }
        }
      } catch (err) {
        if (!aborted) setError(err.message || 'Error');
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    fetchProducts();
    return () => { aborted = true; };
  }, []);

  // derived UI state
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
  const featured = products.slice(0, 8);

  // hero slideshow auto-advance
  useEffect(() => {
    if (!heroImages || heroImages.length === 0) return undefined;
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(t);
  }, [heroImages]);

  function prevHero() {
    if (!heroImages || heroImages.length === 0) return;
    setHeroIndex((i) => (i - 1 + heroImages.length) % heroImages.length);
  }

  function nextHero() {
    if (!heroImages || heroImages.length === 0) return;
    setHeroIndex((i) => (i + 1) % heroImages.length);
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    // Smooth scroll to product grid after a tiny delay to ensure state updates
    setTimeout(() => {
      const elem = document.getElementById('all');
      if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function scrollFeatured(direction) {
    if (!featuredSliderRef.current) return;
    const scrollAmount = 320; // card width + gap
    if (direction === 'left') {
      featuredSliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      featuredSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

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
        {/* Hero */}
        <section className="bg-white dark:bg-gray-800 rounded-lg mb-8 overflow-hidden shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-6 py-10">
            <div>
              <h2 className="text-4xl font-extrabold mb-4">Shop the latest trends</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Discover quality products curated for you — fast shipping, easy returns, and curated deals every week.</p>
              <div className="flex gap-3">
                <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-5 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">Shop Now</button>
                <a href="#featured" className="px-5 py-3 border rounded text-gray-700 dark:text-gray-200">Featured</a>
              </div>
            </div>
            <div className="text-center relative">
              <div className="h-56 flex items-center justify-center overflow-hidden relative">
                {heroImages && heroImages.length > 0 ? (
                  heroImages.map((src, idx) => (
                    <img
                      key={src + idx}
                      src={src}
                      alt={`hero-${idx}`}
                      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-56 object-contain transition-opacity duration-1500ms ease-in-out ${idx === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    />
                  ))
                ) : (
                  <img src="/hero-placeholder.svg" alt="Shop hero" className="mx-auto max-h-56 object-contain" />
                )}
                {/* left/right controls */}
                {heroImages && heroImages.length > 1 && (
                  <>
                    <button onClick={prevHero} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow">
                      ‹
                    </button>
                    <button onClick={nextHero} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow">
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* indicators */}
              {heroImages && heroImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      className={`w-2 h-2 rounded-full ${i === heroIndex ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-500'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse by Category</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 capitalize ${
                  activeCategory === c
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : (
          <>
            {/* Featured Slider */}
            <section id="featured" className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured for You</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trending products this week</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => scrollFeatured('left')} aria-label="Scroll left" className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
                    ‹
                  </button>
                  <button onClick={() => scrollFeatured('right')} aria-label="Scroll right" className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
                    ›
                  </button>
                </div>
              </div>
              <div
                ref={featuredSliderRef}
                className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              >
                {featured.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-60">
                    <ProductCard product={p} onAddToCart={handleAddToCart} isInCart={!!cart.find((c) => c.id === p.id)} onToggleWishlist={toggleWishlist} isInWishlist={!!wishlist.find((w) => (w.externalId && w.externalId === p.id) || (w.productId && w.productId.toString() === p.id))} />
                  </div>
                ))}
              </div>
            </section>

            {/* Product Grid */}
            <section id="all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {activeCategory === 'all' ? 'All Products' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
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
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No products found in this category.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemove={handleRemoveFromCart} />

      <Footer />
    </div>
  );
}

export default HomePage;
