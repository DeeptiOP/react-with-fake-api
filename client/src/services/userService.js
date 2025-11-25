const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class UserService {
  async getAllUsers(page = 1, limit = 10, role = null) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams({ page, limit });
    if (role) params.append('role', role);

    const response = await fetch(`${API_URL}/users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async getUserById(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.user;
  }

  async updateUser(id, updates) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.user;
  }

  async deleteUser(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async toggleUserStatus(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.user;
  }

  async changeUserRole(id, role) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.user;
  }

  // Profile
  async getProfile() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  }

  async updateProfile(updates) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data.user;
  }

  // Wishlist
  async getWishlist() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/wishlist`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch wishlist');
    return data.wishlist;
  }

  async addToWishlist(item) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add to wishlist');
    return data.wishlist;
  }

  async removeFromWishlist(productId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove from wishlist');
    return data.wishlist;
  }

  // Cart
  async getCart() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch cart');
    return data.cart;
  }

  async getCartHistory() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/cart/history`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch cart history');
    return data.carts;
  }

  async checkoutCart() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/cart/checkout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Checkout failed');
    return data;
  }

  async removeCartItem(itemId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove item');
    return data.cart;
  }
}

export default new UserService();
