import User from '../models/User.js';
import Cart from '../models/Cart.js';

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Get logged in user's profile (includes wishlist and cart summary)
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart = await Cart.findOne({ userId: req.user.id });

    res.json({ user: user.toJSON(), cart });
  } catch (error) {
    next(error);
  }
};

// Update logged in user's profile (name, avatar, address)
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, address } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (address) updates.address = address;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Wishlist: get
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
};

// Wishlist: add item
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId, externalId, title, price, image } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates by productId or externalId
    const exists = user.wishlist.some(
      (w) => (w.productId && w.productId.toString() === productId) || (w.externalId && w.externalId === externalId)
    );
    if (exists) return res.status(400).json({ message: 'Product already in wishlist' });

    user.wishlist.push({ productId, externalId, title, price, image });
    await user.save();

    res.status(201).json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Wishlist: remove
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter((w) => !(w.productId && w.productId.toString() === productId) && !(w.externalId && w.externalId.toString() === productId));
    await user.save();

    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.json({ cart: { items: [], totalItems: 0, totalPrice: 0 } });
    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

// Get cart history / past carts (orders)
// Get cart history / past carts (orders) - only completed carts
export const getCartHistory = async (req, res, next) => {
  try {
    // Return only completed carts for the user, most recent first
    const carts = await Cart.find({ userId: req.user.id, status: 'completed' }).sort({ completedAt: -1 });
    res.json({ carts });
  } catch (error) {
    next(error);
  }
};

// Checkout: mark current active cart as completed
export const checkoutCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'No active cart to checkout' });

    // Mark as completed
    cart.status = 'completed';
    cart.completedAt = new Date();
    await cart.save();

    // Create a new empty active cart for the user
    const newCart = await Cart.create({
      userId: req.user.id,
      items: [],
      totalPrice: 0,
      totalItems: 0,
      status: 'active',
    });

    res.json({ message: 'Order placed successfully', completedCart: cart.toObject(), activeCart: newCart.toObject() });
  } catch (error) {
    next(error);
  }
};

// Remove item from active cart
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Remove item by productId or by array index
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId && item.productId?.toString() !== itemId);
    await cart.save();

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id || req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle user active status (admin only)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'User status updated', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Change user role (admin only)
export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};
