import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  getCartHistory,
  checkoutCart,
  removeCartItem,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// User routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Wishlist endpoints
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Cart endpoint
router.get('/cart', getCart);
// Cart history
router.get('/cart/history', getCartHistory);
// Checkout
router.post('/cart/checkout', checkoutCart);
// Remove item from cart
router.delete('/cart/item/:itemId', removeCartItem);

// Admin routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.delete('/:id', authorize('admin'), deleteUser);
router.patch('/:id/status', authorize('admin'), toggleUserStatus);
router.patch('/:id/role', authorize('admin'), changeUserRole);

export default router;
