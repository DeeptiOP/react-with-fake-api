import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [error, setError] = useState('');
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading cart:', err);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Calculate discount amount
  const discountAmount = (subtotal * discountPercent) / 100;

  // Calculate tax (10%)
  const tax = (subtotal - discountAmount) * 0.1;

  // Calculate total
  const total = subtotal - discountAmount + tax;

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  // Handle remove item
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    setError('');
  };

  // Handle discount code
  const handleApplyDiscount = () => {
    setError('');
    const code = discountCode.trim().toUpperCase();

    // Sample discount codes
    const discountCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'SAVE30': 30,
      'WELCOME': 15,
      'NEWUSER': 25,
    };

    if (!code) {
      setError('Please enter a discount code');
      return;
    }

    if (discountCodes[code]) {
      setDiscountPercent(discountCodes[code]);
      setDiscountApplied(true);
      setDiscountCode('');
    } else {
      setError('Invalid discount code');
      setDiscountApplied(false);
      setDiscountPercent(0);
    }
  };

  // Handle remove discount
  const handleRemoveDiscount = () => {
    setDiscountPercent(0);
    setDiscountApplied(false);
    setDiscountCode('');
    setError('');
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!authenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    // Proceed with checkout
    navigate('/checkout', { state: { cartItems, total, discountPercent } });
  };

  // Clear cart
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([]);
      setDiscountPercent(0);
      setDiscountApplied(false);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar cartCount={cartItems.length} wishlistCount={0} onOpenCart={() => {}} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {/* Empty Cart Message */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to get started!
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b dark:border-gray-700 last:border-b-0 p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-24 h-24 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {item.category && `Category: ${item.category}`}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-2">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 text-gray-900 dark:text-gray-100 font-semibold">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right mt-4">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="flex justify-between mb-4 pb-4 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount */}
                {discountApplied && (
                  <div className="flex justify-between mb-4 pb-4 border-b dark:border-gray-700 text-green-600 dark:text-green-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-semibold">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between mb-4 pb-4 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Discount Code Section */}
                <div className="mb-6 pb-6 border-b dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Discount Code
                  </label>
                  {discountApplied ? (
                    <div className="flex gap-2">
                      <div className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                          ✓ Discount Applied
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveDiscount}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code (e.g., SAVE10)"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {error && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Try: SAVE10, SAVE20, SAVE30, WELCOME, or NEWUSER
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition mb-3"
                >
                  {authenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="w-full py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition"
                >
                  Clear Cart
                </button>

                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-xl">🚚</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Free Shipping
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        On orders over $50
                      </p>
                    </div>
                  </div>
                  {subtotal >= 50 && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      ✓ You qualify for free shipping!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
