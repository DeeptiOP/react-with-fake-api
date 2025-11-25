import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      setSuccess(true);
      // For development, we also get the token back
      if (result.devResetToken) {
        setResetToken(result.devResetToken);
      }
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600 mb-6">Enter your email address to receive a password reset link</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">✓ Reset link sent!</p>
              <p className="text-sm text-green-600 mt-2">
                Check your email for a password reset link. The link will expire in 15 minutes.
              </p>
            </div>

            {/* DEV MODE: Show token and link for testing */}
            {resetToken && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">Development Mode - Reset Token:</p>
                <code className="block text-xs bg-yellow-100 p-2 rounded mb-2 break-all">{resetToken}</code>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="block text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium"
                >
                  Continue to Reset
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="block text-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Remember your password? </span>
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
