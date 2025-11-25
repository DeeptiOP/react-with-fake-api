import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments();
    const totalCarts = await Cart.countDocuments();
    
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const usersCreatedThisMonth = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const totalRevenue = await Cart.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalCarts,
        activeUsers,
        inactiveUsers,
        usersCreatedThisMonth,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity
export const getUserActivity = async (req, res, next) => {
  try {
    const recentLogins = await User.find({ lastLogin: { $exists: true } })
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('name email lastLogin -_id');

    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt role -_id');

    res.json({
      recentLogins,
      recentSignups,
    });
  } catch (error) {
    next(error);
  }
};

// Get system logs (simulated)
export const getSystemLogs = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    // In a real app, you would store logs in a database
    const logs = [
      {
        timestamp: new Date(),
        action: 'User registered',
        user: 'system',
        status: 'success',
      },
      {
        timestamp: new Date(Date.now() - 3600000),
        action: 'User login',
        user: 'admin@example.com',
        status: 'success',
      },
      {
        timestamp: new Date(Date.now() - 7200000),
        action: 'Product added',
        user: 'admin@example.com',
        status: 'success',
      },
    ];

    res.json({ logs: logs.slice(0, limit) });
  } catch (error) {
    next(error);
  }
};
