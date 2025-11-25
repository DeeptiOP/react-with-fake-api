# Online Store with API

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB featuring JWT authentication, admin dashboard, wishlist, shopping cart, and order management.

## 🎯 Features

### Authentication & Authorization
- ✅ User Registration & Login with JWT tokens
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Account lockout after 5 failed login attempts (15 min lockdown)
- ✅ Forgot Password & Reset Password flows with email verification
- ✅ Role-based access control (User vs Admin)
- ✅ Session management with token refresh

### User Features
- 👤 User Profile with editable address information
- 💝 Wishlist - Add/Remove products from wishlist
- 🛒 Shopping Cart with checkout functionality
- 📦 Order History with expandable order details
- 🔐 Secure password reset with time-limited tokens

### Admin Features
- 📊 Admin Dashboard with statistics
  - Total users, active users, total products
  - Total revenue, average order value
  - System metrics and health status
- 👥 User Management - View, edit, delete users
- 🔄 Manage user roles (user ↔ admin)
- 📋 Activity & System Logs
- 🔐 Admin-only protected routes

### Product Management
- 📱 Product listing with images and prices
- 🔍 Product search and filtering
- ⭐ Wishlist integration on product cards
- 🛍️ Add to cart functionality

## 🏗️ Project Structure

```
fakestore-cart-app/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── AdminNav.jsx         # Admin navigation bar
│   │   │   ├── Navbar.jsx           # Main navigation
│   │   │   ├── ProductCard.jsx      # Product display card
│   │   │   └── CartModal.jsx        # Shopping cart modal
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.jsx         # Product listing
│   │   │   ├── LoginPage.jsx        # Login form
│   │   │   ├── RegisterPage.jsx     # Registration form
│   │   │   ├── ProfilePage.jsx      # User profile & cart history
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   └── admin/               # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       └── AdminActivity.jsx
│   │   ├── services/                # API services
│   │   │   ├── authService.js       # Authentication API
│   │   │   ├── userService.js       # User API
│   │   │   └── adminService.js      # Admin API
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useAuth.js           # Authentication hook
│   │   ├── contexts/                # Context API
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   └── utils/                   # Utilities
│   │       └── ProtectedRoute.jsx   # Route protection component
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js        # Auth endpoints
│   │   ├── userController.js        # User endpoints
│   │   └── adminController.js       # Admin endpoints
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                  # User model
│   │   ├── Cart.js                  # Cart model
│   │   └── Product.js               # Product model
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Error handling
│   ├── utils/                       # Utility functions
│   │   ├── hashUtils.js             # Password hashing
│   │   └── tokenUtils.js            # JWT token generation
│   ├── scripts/                     # Utility scripts
│   │   ├── createAdmin.js           # Create admin user
│   │   ├── activateAdmin.js         # Activate admin
│   │   └── testAdminLogin.js        # Test login
│   └── server.js                    # Main server file
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DeeptiOP/online-store-with-api.git
cd online-store-with-api
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fakestore-app
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
BCRYPT_ROUNDS=10
EOF

# Create admin user
node scripts/createAdmin.js

# Start server
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify` - Verify authentication
- `GET /api/auth/me` - Get current user

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/wishlist` - Get user's wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/cart` - Get shopping cart
- `GET /api/users/cart/history` - Get order history
- `POST /api/users/cart/checkout` - Checkout cart
- `DELETE /api/users/cart/item/:itemId` - Remove cart item

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/activity` - User activity logs
- `GET /api/admin/logs` - System logs

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiry with secure signing
- **Account Lockout**: 5 failed attempts trigger 15-minute lockdown
- **Password Reset**: Cryptographically secure tokens with 15-minute expiry
- **CORS**: Enabled for development
- **Protected Routes**: Role-based access control on frontend and backend
- **Select Fields**: Sensitive fields excluded from responses

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed, not selected by default),
  role: 'user' | 'admin',
  avatar: String,
  address: {
    line1, line2, city, state, postal, country, phone
  },
  wishlist: [{
    externalId, title, price, image, addedAt
  }],
  isActive: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt, updatedAt: Date
}
```

### Cart Model
```javascript
{
  userId: ObjectId (ref User),
  items: [{
    externalId, title, price, quantity, image
  }],
  totalPrice: Number,
  totalItems: Number,
  status: 'active' | 'completed' | 'abandoned',
  completedAt: Date,
  createdAt, updatedAt: Date
}
```

## 🛠️ Development

### Start both servers
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

### Admin Dashboard
After logging in as admin, access:
- Dashboard: http://localhost:5173/admin/dashboard
- Manage Users: http://localhost:5173/admin/users
- View Activity: http://localhost:5173/admin/activity

### Testing
```bash
# Test admin login
cd server
node scripts/testAdminLogin.js

# Activate admin user
node scripts/activateAdmin.js
```

## 📦 Dependencies

### Frontend
- React 18.2.0
- React Router DOM 6.16.0
- Vite 5.0.0+
- Tailwind CSS 3.4.1
- Axios (via fetch API)

### Backend
- Express.js 4.18.2
- MongoDB/Mongoose 7.5.0
- JWT (jsonwebtoken 9.0.0+)
- bcryptjs 2.4.3
- CORS 2.8.5
- Dotenv 16.3.1

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables on hosting platform
2. Push to git repository
3. Platform automatically deploys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or support, please contact the development team.

## 🎉 Acknowledgments

- FakeStore API for product data
- Tailwind CSS for styling
- MongoDB for database
- Express.js for backend framework

---

**Happy Coding! 🚀**
