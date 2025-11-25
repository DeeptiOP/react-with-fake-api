# FakeStore Cart App - Complete Authentication System

This is a production-level authentication system with admin dashboard and role-based access control.

## Features

### Authentication
- ✅ User Registration with email validation
- ✅ Secure Login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Account lock after 5 failed attempts
- ✅ Session management
- ✅ Logout functionality

### Authorization
- ✅ Role-based access control (User, Admin)
- ✅ Protected routes with authentication middleware
- ✅ Admin-only endpoints
- ✅ User activity tracking

### Admin Dashboard
- ✅ Dashboard with statistics
- ✅ User management interface
- ✅ Activity logs
- ✅ System monitoring

## Project Structure

```
fakestore-cart-app/
├── server/                    # Backend (Node.js/Express)
│   ├── config/               # Configuration files
│   │   └── database.js       # MongoDB connection
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # Authentication & authorization
│   │   └── errorHandler.js
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/               # Utility functions
│   │   ├── tokenUtils.js   # JWT operations
│   │   └── hashUtils.js    # Password hashing
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── server.js            # Main server file
│
└── client/                    # Frontend (React)
    ├── src/
    │   ├── components/       # React components
    │   ├── contexts/         # React contexts
    │   │   └── AuthContext.jsx
    │   ├── hooks/            # Custom hooks
    │   │   └── useAuth.js
    │   ├── pages/            # Page components
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── admin/        # Admin pages
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminUsers.jsx
    │   │       └── AdminActivity.jsx
    │   ├── services/         # API services
    │   │   ├── authService.js
    │   │   ├── userService.js
    │   │   └── adminService.js
    │   ├── utils/            # Utilities
    │   │   └── ProtectedRoute.jsx
    │   ├── .env.example
    │   ├── main.jsx          # App entry with routing
    │   └── App.jsx
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fakestore-cart
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
BCRYPT_ROUNDS=10
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

5. Start MongoDB (if using local):
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

6. Start the server:
```bash
npm start
# or with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout (requires auth)
- `GET /verify` - Verify token (requires auth)
- `GET /me` - Get current user (requires auth)

### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID (admin only)
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (admin only)
- `PATCH /:id/status` - Toggle user status (admin only)
- `PATCH /:id/role` - Change user role (admin only)

### Admin (`/api/admin`)
- `GET /dashboard/stats` - Get dashboard statistics (admin only)
- `GET /activity` - Get user activity (admin only)
- `GET /logs` - Get system logs (admin only)

## Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Test User:**
- Create via registration form

## Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Minimum 6 characters
   - Never stored in plain text

2. **JWT Authentication**
   - Secure token generation
   - 7-day expiration
   - Claims-based authorization

3. **Rate Limiting**
   - Account lockout after 5 failed login attempts
   - 15-minute lock duration

4. **Access Control**
   - Role-based authorization
   - Protected routes
   - Admin-only endpoints

5. **Data Validation**
   - Email format validation
   - Input sanitization
   - Error handling

## Frontend Features

### Public Pages
- Home/Products page
- Login page
- Registration page

### Protected Pages
- Admin Dashboard (statistics overview)
- User Management (admin only)
- Activity & Logs (admin only)

### Components
- AuthContext for state management
- useAuth hook for accessing auth state
- ProtectedRoute component for route protection
- Responsive navbar with user menu

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | admin),
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
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

### Cart Schema
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    externalId: Number,
    title: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  totalItems: Number
}
```

## Environment Variables

### Server
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - Token expiration time
- `NODE_ENV` - Environment (development/production)
- `BCRYPT_ROUNDS` - Password hashing rounds

### Client
- `VITE_API_URL` - Backend API URL

## Running Tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## Deployment

### Backend (Heroku/Railway/Render)
1. Install production dependencies
2. Set environment variables
3. Deploy with: `git push heroku main`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder

## Best Practices Implemented

✅ JWT-based authentication
✅ Password hashing with bcrypt
✅ Environment variables for sensitive data
✅ Error handling middleware
✅ Role-based access control
✅ Account security (lockout, attempts)
✅ Clean code architecture
✅ Separation of concerns
✅ Protected API endpoints
✅ Protected React routes

## Troubleshooting

### Cannot connect to MongoDB
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS errors
- Check backend CORS configuration
- Verify `VITE_API_URL` matches backend URL

### Auth token not working
- Clear localStorage and reload
- Check token expiration
- Verify JWT_SECRET matches

### Admin routes not accessible
- Ensure user has admin role
- Check token validity
- Verify authorization middleware

## Next Steps

1. Add email verification
2. Implement password reset
3. Add two-factor authentication
4. Setup product management for admins
5. Implement payment processing
6. Add analytics dashboard
7. Setup automated backups
8. Implement API rate limiting

---

Built with React, Express, MongoDB, and Tailwind CSS
