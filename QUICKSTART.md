# Complete Authentication System - Quick Reference

## What Has Been Implemented

### 1. **Backend Server (Node.js/Express)**
- ✅ JWT-based authentication system
- ✅ Password hashing with bcrypt
- ✅ MongoDB database integration
- ✅ RESTful API endpoints
- ✅ Role-based access control (RBAC)
- ✅ Error handling middleware
- ✅ Account security features (lockout, attempt tracking)

### 2. **Frontend (React with Vite)**
- ✅ Authentication pages (Login/Register)
- ✅ Admin dashboard with statistics
- ✅ User management interface
- ✅ Activity logs and monitoring
- ✅ Protected routes with role checking
- ✅ Auth context for state management
- ✅ Responsive UI with Tailwind CSS
- ✅ Dark mode support

### 3. **Database Models**
- User (authentication, roles, activity tracking)
- Product (product catalog)
- Cart (shopping cart management)

### 4. **Security Features**
- Bcrypt password hashing (10 rounds)
- JWT token-based authentication
- Account lockout (5 failed attempts = 15 min lock)
- Role-based authorization
- Protected API endpoints
- Environment-based configuration

---

## Getting Started (5 Minutes)

### Windows Users

1. **Open PowerShell in your project directory**

2. **Run the setup script:**
   ```powershell
   .\setup.bat
   ```
   This will:
   - Install all backend dependencies
   - Install all frontend dependencies
   - Create environment files

3. **Update MongoDB connection** (if needed):
   - Edit `server/.env`
   - Change `MONGODB_URI` if not using local MongoDB

4. **Start MongoDB** (if using local):
   ```powershell
   mongod
   ```

5. **Start Backend** (new terminal):
   ```powershell
   cd server
   npm run dev
   ```
   Runs on: `http://localhost:5000`

6. **Start Frontend** (new terminal):
   ```powershell
   cd client
   npm run dev
   ```
   Runs on: `http://localhost:5173`

7. **Login with demo credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

---

## File Structure Overview

```
fakestore-cart-app/
│
├── server/
│   ├── config/database.js              # DB connection
│   ├── controllers/
│   │   ├── authController.js           # Auth logic
│   │   ├── userController.js           # User management
│   │   └── adminController.js          # Admin functions
│   ├── middleware/
│   │   ├── auth.js                     # JWT verification
│   │   └── errorHandler.js             # Error handling
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   ├── Product.js                  # Product schema
│   │   └── Cart.js                     # Cart schema
│   ├── routes/
│   │   ├── authRoutes.js               # Auth endpoints
│   │   ├── userRoutes.js               # User endpoints
│   │   └── adminRoutes.js              # Admin endpoints
│   ├── utils/
│   │   ├── tokenUtils.js               # JWT functions
│   │   └── hashUtils.js                # Password functions
│   ├── .env.example                    # Config template
│   ├── package.json
│   └── server.js                       # Main server
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Updated with auth
│   │   │   ├── ProductCard.jsx         # Product display
│   │   │   └── CartModal.jsx           # Shopping cart
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx         # Auth state (⭐ KEY)
│   │   ├── hooks/
│   │   │   └── useAuth.js              # Auth hook (⭐ KEY)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Home/Products
│   │   │   ├── LoginPage.jsx           # Login form
│   │   │   ├── RegisterPage.jsx        # Registration form
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx  # Stats dashboard
│   │   │       ├── AdminUsers.jsx      # User management
│   │   │       └── AdminActivity.jsx   # Activity logs
│   │   ├── services/
│   │   │   ├── authService.js          # Auth API calls
│   │   │   ├── userService.js          # User API calls
│   │   │   └── adminService.js         # Admin API calls
│   │   ├── utils/
│   │   │   └── ProtectedRoute.jsx      # Route protection (⭐ KEY)
│   │   ├── .env.example
│   │   ├── main.jsx                    # App with routing
│   │   └── App.jsx
│   └── package.json
│
├── README_AUTH.md                      # 📖 Full documentation
├── DEPLOYMENT.md                       # 📖 Production guide
├── ARCHITECTURE.md                     # 📖 System design
├── setup.sh                            # Setup script (Mac/Linux)
├── setup.bat                           # Setup script (Windows)
└── .gitignore
```

---

## API Endpoints Quick Reference

### 🔐 Authentication (`/api/auth`)
```
POST   /register              Register new user
POST   /login                 Login user
POST   /logout                Logout (requires token)
GET    /verify                Verify token (requires token)
GET    /me                    Get current user (requires token)
```

### 👥 Users (`/api/users`)
```
GET    /                      List all users (admin only)
GET    /:id                   Get user by ID (admin only)
PUT    /:id                   Update user
DELETE /:id                   Delete user (admin only)
PATCH  /:id/status            Toggle user active status (admin only)
PATCH  /:id/role              Change user role (admin only)
```

### 🔧 Admin (`/api/admin`)
```
GET    /dashboard/stats       Get dashboard statistics (admin only)
GET    /activity              Get user activity (admin only)
GET    /logs                  Get system logs (admin only)
```

---

## Key Frontend Components

### AuthContext (State Management)
Located: `client/src/contexts/AuthContext.jsx`
```javascript
// Provides:
- user (current user object)
- authenticated (boolean)
- loading (boolean)
- isAdmin (boolean)
- login(email, password)
- register(name, email, password, confirmPassword)
- logout()
```

### useAuth Hook (Custom Hook)
Located: `client/src/hooks/useAuth.js`
```javascript
// Usage:
const { user, authenticated, login, logout, isAdmin } = useAuth();
```

### ProtectedRoute Component
Located: `client/src/utils/ProtectedRoute.jsx`
```javascript
// Usage:
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

---

## Database Schemas

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  externalId: Number,
  title: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  rating: { rate: Number, count: Number },
  isFeatured: Boolean
}
```

### Cart
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    title: String,
    price: Number,
    image: String,
    quantity: Number
  }],
  totalPrice: Number,
  totalItems: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fakestore-cart
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
BCRYPT_ROUNDS=10
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Common Tasks

### Create a New Admin User
1. Go to `/register` page
2. Register a new account
3. Use backend to update role:
   ```javascript
   // In database or via admin panel
   user.role = 'admin';
   ```

### Change User Role
Admin can navigate to `/admin/users` and change roles in the UI.

### View User Activity
Admin can navigate to `/admin/activity` to see recent logins and signups.

### Check Dashboard Stats
Admin can navigate to `/admin/dashboard` for real-time statistics.

---

## Authentication Flow

```
┌─────────────┐
│   User      │
│  Registers  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Register Form            │
│  POST /api/auth/register            │
│  { name, email, password }          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend: authController.register   │
│  - Validate input                   │
│  - Hash password with bcrypt        │
│  - Create user in MongoDB           │
│  - Generate JWT token              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Store token              │
│  localStorage.setItem('authToken')  │
│  Update AuthContext state           │
│  Redirect to home                   │
└─────────────────────────────────────┘
```

---

## Login Flow

```
┌──────────────┐
│   User       │
│   Logins     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Frontend: Login Form        │
│  POST /api/auth/login        │
│  { email, password }         │
└──────┬───────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Backend: authController.login         │
│  - Find user by email                  │
│  - Compare password with bcrypt        │
│  - Check account lockout               │
│  - Update last login                   │
│  - Generate JWT token                  │
└──────┬─────────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Return: JWT Token + User    │
└──────┬───────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  Frontend: Store + Redirect        │
│  If admin: /admin/dashboard        │
│  If user: /                        │
└────────────────────────────────────┘
```

---

## Protected Routes Flow

```
┌─────────────────────────────┐
│  User requests /admin/users │
└──────┬──────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  ProtectedRoute Component              │
│  - Check authenticated                 │
│  - Check requiredRole                  │
└──────┬─────────────────────────────────┘
       │
       ├─ Not authenticated? ─────────────→ Redirect to /login
       │
       ├─ Wrong role? ──────────────────→ Redirect to /
       │
       └─ All checks pass? ──────────────→ Render component
```

---

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Account lockout after 5 failed attempts
- ✅ Protected API endpoints
- ✅ Protected React routes
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Error handling without exposing details
- ✅ Input validation
- ✅ Role-based access control

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check connection string in `.env`
- Default: `mongodb://localhost:27017/fakestore-cart`

### "Login failed - Invalid credentials"
- Check email and password
- Ensure user exists in database
- Check if account is locked (5 failed attempts)

### "CORS error"
- Verify backend CORS is enabled
- Check `VITE_API_URL` is correct
- Ensure frontend and backend are running

### "Admin dashboard not accessible"
- Ensure user has admin role
- Check token hasn't expired
- Clear browser cache and localStorage

### "No data showing in admin dashboard"
- Check MongoDB connection
- Ensure users exist in database
- Check API endpoints in browser console

---

## Next Steps for Enhancement

1. **Email Verification** - Verify user email on registration
2. **Password Reset** - Implement forgot password flow
3. **Two-Factor Authentication** - Add 2FA support
4. **Product Management** - Admin can add/edit products
5. **Orders** - Implement order checkout system
6. **Analytics** - Advanced user behavior tracking
7. **Notifications** - Email/SMS notifications
8. **Payment Gateway** - Stripe/PayPal integration

---

## Support & Documentation

- 📖 Full docs: `README_AUTH.md`
- 🚀 Deployment: `DEPLOYMENT.md`
- 🏗️ Architecture: `ARCHITECTURE.md`
- 🎯 This guide: `QUICKSTART.md`

---

**Built with:** React • Express • MongoDB • Tailwind CSS • Vite

**Last Updated:** December 2024
