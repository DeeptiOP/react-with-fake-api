import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';

export default function ProfilePage() {
  const { user, authenticated, loading, error } = useAuth();
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState(null);
  const [cartHistory, setCartHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', avatar: '', address: {} });
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data.user);
        setCart(data.cart);
        setWishlist(data.user.wishlist || []);
        setForm({
          name: data.user.name || '',
          avatar: data.user.avatar || '',
          address: data.user.address || {},
        });
      } catch (err) {
        console.error('Profile load error', err);
      }
    };
    if (authenticated) load();
  }, [authenticated]);

  // load cart history when authenticated
  useEffect(() => {
    if (!authenticated) {
      setCartHistory([]);
      return;
    }

    let cancelled = false;
    const loadHistory = async () => {
      try {
        const history = await userService.getCartHistory();
        if (!cancelled) {
          setCartHistory(history || []);
        }
      } catch (err) {
        console.error('Failed to load cart history', err);
      }
    };
    // Add a small delay to ensure profile is loaded first
    const timer = setTimeout(() => {
      loadHistory();
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [authenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((f) => ({ ...f, address: { ...(f.address || {}), [key]: value } }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile(form);
      setProfile(updated);
      setEditing(false);
      // Optionally refresh auth context
      window.location.reload();
    } catch (err) {
      console.error('Save profile error', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddToWishlist = async (item) => {
    try {
      const wl = await userService.addToWishlist(item);
      setWishlist(wl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const wl = await userService.removeFromWishlist(productId);
      setWishlist(wl);
    } catch (err) {
      console.error(err);
    }
  };

  // Cart handlers
  const handleRemoveFromCart = async (itemId) => {
    try {
      setCartMessage('Removing item...');
      const updatedCart = await userService.removeCartItem(itemId);
      setCart(updatedCart);
      setCartMessage('Item removed successfully');
      setTimeout(() => setCartMessage(''), 2000);
    } catch (err) {
      console.error('Remove item error', err);
      setCartMessage(err.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.totalItems === 0) {
      setCartMessage('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    setCartMessage('Processing order...');
    try {
      const result = await userService.checkoutCart();
      setCart(result.activeCart);
      setCartHistory([result.completedCart, ...cartHistory]);
      setCartMessage('Order placed successfully! ✓');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      console.error('Checkout error', err);
      setCartMessage(err.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!authenticated) return <div className="p-6">Please login to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex items-center space-x-4">
          <img src={profile?.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
          <div>
            <div className="text-lg font-medium">{profile?.name}</div>
            <div className="text-sm text-gray-500">{profile?.email}</div>
          </div>
        </div>

        <div className="mt-4">
          {!editing ? (
            <>
              <div className="mb-2">
                <strong>Address:</strong>
                <div>{profile?.address?.line1}</div>
                <div>{profile?.address?.line2}</div>
                <div>
                  {profile?.address?.city} {profile?.address?.state} {profile?.address?.postalCode}
                </div>
                <div>{profile?.address?.country}</div>
                <div>{profile?.address?.phone}</div>
              </div>
              <button onClick={() => setEditing(true)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit Profile</button>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
              <input name="avatar" value={form.avatar} onChange={handleChange} className="border p-2 rounded" />
              <input name="address.line1" value={form.address.line1 || ''} onChange={handleChange} placeholder="Address line 1" className="border p-2 rounded" />
              <input name="address.line2" value={form.address.line2 || ''} onChange={handleChange} placeholder="Address line 2" className="border p-2 rounded" />
              <div className="flex gap-2">
                <input name="address.city" value={form.address.city || ''} onChange={handleChange} placeholder="City" className="border p-2 rounded flex-1" />
                <input name="address.state" value={form.address.state || ''} onChange={handleChange} placeholder="State" className="border p-2 rounded w-32" />
                <input name="address.postalCode" value={form.address.postalCode || ''} onChange={handleChange} placeholder="Postal" className="border p-2 rounded w-32" />
              </div>
              <input name="address.country" value={form.address.country || ''} onChange={handleChange} placeholder="Country" className="border p-2 rounded" />
              <input name="address.phone" value={form.address.phone || ''} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />

              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded p-4">
        <h2 className="text-lg font-medium mb-3">Cart History</h2>
        {cartHistory.length === 0 ? (
          <div className="text-sm text-gray-500">No previous carts/orders found.</div>
        ) : (
          <div className="space-y-3">
            {cartHistory.map((c) => (
              <details key={c._id} className="border rounded p-3">
                <summary className="flex justify-between items-center cursor-pointer">
                  <div className="text-sm">
                    <div className="font-medium">{new Date(c.updatedAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Items: {c.totalItems} • Total: ${c.totalPrice} • Status: {c.status}</div>
                  </div>
                  <div className="text-sm text-indigo-600">View</div>
                </summary>
                <div className="mt-2">
                  <ul className="space-y-2">
                    {c.items && c.items.map((it) => (
                      <li key={it._id || it.productId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {it.image && <img src={it.image} alt={it.title} className="w-12 h-12 object-cover rounded" />}
                          <div>
                            <div className="font-medium">{it.title}</div>
                            <div className="text-sm text-gray-500">Qty: {it.quantity} • ${it.price}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">${(it.price * it.quantity).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-3">Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="text-sm text-gray-500">No items in wishlist</div>
          ) : (
            <ul className="space-y-2">
              {wishlist.map((w) => (
                <li key={w._id || w.productId || w.externalId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {w.image && <img src={w.image} alt={w.title} className="w-12 h-12 object-cover rounded" />}
                    <div>
                      <div className="font-medium">{w.title}</div>
                      <div className="text-sm text-gray-500">${w.price}</div>
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleRemoveFromWishlist(w.productId || w.externalId)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-3">Cart Summary</h2>
          {cartMessage && (
            <div className={`mb-3 p-2 rounded text-sm ${cartMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {cartMessage}
            </div>
          )}
          {cart && cart.totalItems > 0 ? (
            <div>
              <div className="text-sm text-gray-600 mb-2">Items: {cart.totalItems}</div>
              <div className="text-lg font-bold text-indigo-700 mb-3">Total: ${cart.totalPrice.toFixed(2)}</div>
              <ul className="mt-2 space-y-2 mb-3">
                {cart.items && cart.items.map((it) => (
                  <li key={it._id || it.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3 flex-1">
                      {it.image && <img src={it.image} alt={it.title} className="w-10 h-10 object-cover rounded" />}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{it.title}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity} • ${it.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">${(it.price * it.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => handleRemoveFromCart(it._id)} 
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {checkoutLoading ? 'Processing...' : 'Checkout & Place Order'}
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Your cart is empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
