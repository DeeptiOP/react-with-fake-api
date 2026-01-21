import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all products on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=0');
        if (res.ok) {
          const json = await res.json();
          setProducts(json.products || []);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }
    fetchProducts();
  }, []);

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase()) ||
        p.description.toLowerCase().includes(value.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(value.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim().length > 0 && setShowSuggestions(true)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Search"
        >
          🔍
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map(product => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 flex items-center gap-3 transition-colors"
            >
              <img
                src={product.thumbnail || product.image}
                alt={product.title}
                className="w-10 h-10 object-contain"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {product.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ${product.price}
                </div>
              </div>
            </button>
          ))}
          {suggestions.length < products.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          ).length && (
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
              + More results available
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && searchTerm.trim().length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 px-4 py-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">No products found</p>
        </div>
      )}
    </div>
  );
}
