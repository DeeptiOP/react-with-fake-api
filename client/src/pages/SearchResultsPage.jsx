import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('https://dummyjson.com/products?limit=0');
        if (!res.ok) throw new Error('Failed to fetch products');
        const json = await res.json();
        const data = json.products || [];
        setProducts(data);

        // Filter based on search query
        if (searchQuery.trim()) {
          const filtered = data.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) return prevCart;
      return [...prevCart, { ...product, cartId: Date.now() }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(w => w.id === product.id);
      return exists
        ? prevWishlist.filter(w => w.id !== product.id)
        : [...prevWishlist, { ...product, wishlistId: Date.now() }];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery && `Results for "${searchQuery}"`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'Please search for something'}
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isInCart={!!cart.find(c => c.id === product.id)}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={!!wishlist.find(w => w.id === product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
