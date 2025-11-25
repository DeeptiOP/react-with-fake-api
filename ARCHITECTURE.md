# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React/Vite)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Pages & Components                        │  │
│  │  - HomePage, LoginPage, RegisterPage               │  │
│  │  - AdminDashboard, AdminUsers, AdminActivity       │  │
│  │  - ProductCard, CartModal, Navbar                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Context & State Management                │  │
│  │  - AuthContext (user, authenticated, isAdmin)       │  │
│  │  - useAuth hook for accessing auth state            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Route Protection                          │  │
│  │  - ProtectedRoute component                         │  │
│  │  - Role-based access control                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Services                              │  │
│  │  - authService (login, register, logout)           │  │
│  │  - userService (user management)                    │  │
│  │  - adminService (dashboard, activity, logs)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                   HTTP/REST │ JSON
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Server (Express/Node)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Routes                                    │  │
│  │  - /api/auth (register, login, verify)             │  │
│  │  - /api/users (CRUD operations)                    │  │
│  │  - /api/admin (dashboard, activity, logs)          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Middleware                                │  │
│  │  - CORS - Cross-origin requests                    │  │
│  │  - authenticate - JWT verification                 │  │
│  │  - authorize - Role-based authorization            │  │
│  │  - errorHandler - Error handling                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Controllers                               │  │
│  │  - authController (register, login, verify)        │  │
│  │  - userController (user operations)                │  │
│  │  - adminController (dashboard, statistics)         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Utilities                                 │  │
│  │  - tokenUtils (JWT generation/verification)       │  │
│  │  - hashUtils (password hashing/comparison)         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                       MongoDB │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Collections                               │  │
│  │  - users (authentication, roles, activity)         │  │
│  │  - products (product catalog)                      │  │
│  │  - carts (shopping carts)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow Diagram

```
User Interaction
    │
    ├─ Register
    │   └─→ POST /api/auth/register
    │        └─→ Validate input
    │        └─→ Hash password (bcrypt)
    │        └─→ Create user in DB
    │        └─→ Generate JWT token
    │        └─→ Return token + user
    │        └─→ Store in localStorage
    │
    ├─ Login
    │   └─→ POST /api/auth/login
    │        └─→ Find user by email
    │        └─→ Compare password (bcrypt)
    │        └─→ Check account lockout
    │        └─→ Update last login
    │        └─→ Generate JWT token
    │        └─→ Return token + user
    │        └─→ Store in localStorage
    │
    ├─ Access Protected Resource
    │   └─→ GET /api/admin/dashboard/stats
    │        ├─→ Check Authorization header
    │        ├─→ Verify JWT token
    │        ├─→ Check user role
    │        └─→ Return data if authorized
    │
    └─ Logout
        └─→ POST /api/auth/logout
             └─→ Clear token from localStorage
             └─→ Redirect to login
```

## Data Flow

### User Registration
```
User Input (name, email, password)
    ↓
Validation (email format, password length)
    ↓
Check if user exists
    ↓
Hash password with bcrypt
    ↓
Save to MongoDB
    ↓
Generate JWT token
    ↓
Return token + user object
    ↓
Store in localStorage
    ↓
Update AuthContext
    ↓
Redirect to home
```

### Admin Dashboard Access
```
Admin clicks "Admin Dashboard"
    ↓
ProtectedRoute checks:
  - Is user authenticated? (token exists)
  - Is user an admin? (role === 'admin')
    ↓
Request dashboard stats
  - Include token in Authorization header
    ↓
Server middleware:
  - Verify token is valid
  - Extract user ID and role
    ↓
Check user role (must be admin)
    ↓
Query database for statistics
    ↓
Return stats to client
    ↓
Display on dashboard
```

## Component Hierarchy

```
App (main.jsx with BrowserRouter)
│
├─ AuthProvider (context provider)
│  │
│  └─ Routes
│     │
│     ├─ Public Routes
│     │  ├─ HomePage
│     │  │  └─ Navbar
│     │  │  └─ ProductCard
│     │  │  └─ CartModal
│     │  ├─ LoginPage
│     │  └─ RegisterPage
│     │
│     └─ Protected Routes
│        ├─ AdminDashboard (requires admin)
│        │  └─ StatCard (x4)
│        ├─ AdminUsers (requires admin)
│        │  └─ UserTable
│        └─ AdminActivity (requires admin)
│           ├─ RecentLogins
│           ├─ RecentSignups
│           └─ SystemLogs
```

## State Management

### AuthContext provides:
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    role: 'user' | 'admin',
    avatar: string,
    isActive: boolean,
    lastLogin: datetime,
    createdAt: datetime
  },
  authenticated: boolean,
  loading: boolean,
  error: string | null,
  isAdmin: boolean,
  login: (email, password) => Promise,
  register: (name, email, password, confirmPassword) => Promise,
  logout: () => Promise
}
```

## API Response Structure

### Success Response
```javascript
{
  message: "Operation successful",
  data: { /* actual data */ },
  token: "jwt_token_here" // if applicable
}
```

### Error Response
```javascript
{
  message: "Error description",
  status: 400 | 401 | 403 | 404 | 500
}
```

## Security Layers

```
1. Client-Side Security
   └─ ProtectedRoute component
   └─ useAuth hook validation
   └─ Token storage in localStorage
   └─ HTTPS for production

2. Transport Security
   └─ HTTPS/TLS encryption
   └─ CORS policy enforcement
   └─ Token in Authorization header

3. Server-Side Security
   └─ JWT verification middleware
   └─ Role-based authorization
   └─ Input validation
   └─ Rate limiting (configurable)

4. Database Security
   └─ Password hashing (bcrypt)
   └─ User authentication
   └─ Encrypted connections
   └─ Backup and encryption
```

## Token Flow

```
Browser                           Server
  │                                │
  ├─ POST /login ─────────────────→│
  │                                │
  │←──── JWT Token + User Data ─────┤
  │                                │
  ├─ Store in localStorage ─┐      │
  │                         │      │
  │  GET /api/admin/stats   │      │
  │  Header: Bearer token ──┼─────→│
  │                         │      │
  │                         │      ├─ Verify token
  │                         │      ├─ Check role
  │                         │      │
  │←────── Dashboard data ──┴──────┤
  │                                │
  └────────────────────────────────┘
```

## Role-Based Access Control (RBAC)

```
Routes                    Required Role   Handler
├─ POST /auth/register    PUBLIC          authController.register
├─ POST /auth/login       PUBLIC          authController.login
├─ GET /auth/verify       AUTHENTICATED   authController.verifyAuth
├─ GET /auth/me           AUTHENTICATED   authController.getCurrentUser
├─ GET /users             ADMIN           userController.getAllUsers
├─ DELETE /users/:id      ADMIN           userController.deleteUser
├─ PATCH /users/:id/role  ADMIN           userController.changeUserRole
├─ GET /admin/dashboard   ADMIN           adminController.getDashboardStats
├─ GET /admin/activity    ADMIN           adminController.getUserActivity
└─ GET /admin/logs        ADMIN           adminController.getSystemLogs
```

## Error Handling Strategy

```
Client Error                          Server Response
├─ Missing required fields ───────────→ 400 Bad Request
├─ Invalid email format ──────────────→ 400 Bad Request
├─ No authentication token ───────────→ 401 Unauthorized
├─ Invalid/expired token ─────────────→ 401 Unauthorized
├─ Insufficient permissions ─────────→ 403 Forbidden
├─ User not found ────────────────────→ 404 Not Found
├─ Email already exists ──────────────→ 400 Conflict
└─ Server error ──────────────────────→ 500 Internal Server Error
```

## Database Schema Relationships

```
User
├─ 1-to-Many → Cart
│             └─ contains items
│
└─ References → Role (embedded)
              └─ 'user' or 'admin'

Product
└─ Referenced by → Cart.items
                  └─ Via externalId

Cart
├─ References → User (userId)
└─ References → Product (via items.productId)
```

## Deployment Architecture

```
Production Environment

┌──────────────────────────────────────────────────┐
│ CDN / Static Hosting (Vercel/Netlify)           │
│ └─ React app (dist folder)                      │
│    └─ Global CDN distribution                   │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│ API Gateway / Load Balancer                      │
│ └─ Routes requests to backend servers           │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│ Application Servers (Heroku/Railway/Render)    │
│ ├─ Express server (multiple instances)          │
│ ├─ PM2 process manager                          │
│ └─ Auto-scaling enabled                         │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│ Database (MongoDB Atlas)                        │
│ ├─ Sharded cluster                              │
│ ├─ Automated backups                            │
│ └─ Encryption at rest                           │
└──────────────────────────────────────────────────┘
```

## Performance Considerations

```
1. Frontend Optimization
   └─ Code splitting with React.lazy
   └─ Image optimization
   └─ Caching with localStorage
   └─ Lazy loading components

2. Backend Optimization
   └─ Database indexing
   └─ Query optimization
   └─ Caching with Redis (optional)
   └─ Connection pooling

3. Network Optimization
   └─ Compression (gzip)
   └─ CDN for static assets
   └─ HTTP/2 support
   └─ Minification
```

---

**Last Updated:** December 2024
