import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { comparePassword, hashPassword } from '../utils/hashUtils.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempting login with email:', email);

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('[LOGIN] User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('[LOGIN] User found:', user.email, 'Role:', user.role);

    if (!user.isActive) {
      console.log('[LOGIN] Account inactive');
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      console.log('[LOGIN] Account locked');
      return res.status(429).json({ message: 'Account is locked. Try again later' });
    }

    console.log('[LOGIN] Comparing passwords...');
    const isMatch = await comparePassword(password, user.password);
    console.log('[LOGIN] Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('[LOGIN] Password mismatch');
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    console.log('[LOGIN] Password matched! Resetting attempts and generating token');
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    console.log('[LOGIN] Login successful for:', email);
    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error.message);
    next(error);
  }
};

// Verify token
export const verifyAuth = (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Forgot Password - generate reset token and send (simulated)
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not (security)
      return res.status(200).json({ message: 'If this email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token and expiry (15 minutes)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // In production, send email here. For now, return the token (DEV ONLY - REMOVE IN PROD)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Simulate email sending (in production, use nodemailer or similar)
    console.log(`[PASSWORD RESET] Email sent to ${email}. Reset URL: ${resetUrl}`);

    res.json({
      message: 'If this email exists, a reset link has been sent',
      // DEV ONLY - Remove in production
      devResetToken: resetToken,
      devResetUrl: resetUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password - verify token and set new password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the token to compare with stored value
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    next(error);
  }
};
