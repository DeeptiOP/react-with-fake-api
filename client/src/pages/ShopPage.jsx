import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useQuery();
  let categoryQuery = (query.get('category') || '').toLowerCase();
  // normalize some friendly category names to match fakestoreapi categories
  if (categoryQuery === 'jewelry') categoryQuery = 'jewelery';

  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (!mounted) return;
        setProducts(data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Error fetching products');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  const filtered = !categoryQuery || categoryQuery === 'all'
    ? products
    : products.filter(p => (p.category || '').toLowerCase().includes(categoryQuery));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shop</h1>
        {categoryQuery && <div className="text-sm text-gray-500">Category: <span className="font-medium">{categoryQuery}</span></div>}
      </div>

      {loading && <div className="text-center py-10">Loading products...</div>}
      {error && <div className="text-center text-red-500 py-6">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="border rounded-lg p-3 bg-white shadow-sm">
                <Link to={`/product/${p.id}`} className="flex flex-col items-center">
                  <img src={p.image} alt={p.title} className="h-32 object-contain mb-2" />
                  <div className="text-sm font-semibold text-gray-800 text-center">{p.title}</div>
                  <div className="text-indigo-600 font-bold mt-2">${p.price}</div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-sm text-gray-500">Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>
        </>
      )}
    </div>
  );
}
