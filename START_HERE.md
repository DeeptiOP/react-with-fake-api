# 🚀 START HERE - Getting Started Guide

## Welcome! 👋

You now have a **complete, production-ready authentication system** for your fakestore-cart app.

This guide will get you up and running in **5 minutes**.

---

## ⚡ Quick Start (Choose Your Platform)

### 🪟 Windows Users

**Step 1:** Open PowerShell in your project directory
```powershell
# Navigate to your project
cd "c:\Users\deept\Desktop\guvi assingments\fakestore-cart-app"
```

**Step 2:** Run the setup script
```powershell
.\setup.bat
```

This automatically:
- Installs all backend dependencies
- Installs all frontend dependencies
- Creates `.env` files

**Step 3:** Start MongoDB (if using local)
```powershell
mongod
```
*(Leave this running in a separate terminal)*

**Step 4:** Start the backend
```powershell
cd server
npm run dev
```
*(Server starts on http://localhost:5000)*

**Step 5:** Start the frontend (new terminal)
```powershell
cd client
npm run dev
```
*(App opens on http://localhost:5173)*

**Step 6:** Login with demo credentials
```
Email: admin@example.com
Password: admin123
```

✅ **Done!** You're up and running.

---

### 🍎 Mac/Linux Users

**Step 1:** Open Terminal in your project directory
```bash
cd fakestore-cart-app
```

**Step 2:** Run the setup script
```bash
chmod +x setup.sh
./setup.sh
```

**Step 3-6:** Same as Windows (above)

---

## 📖 What to Read Next

### If you want to...

**...understand what was built?**
→ Read `COMPLETE.md` (5 min read)

**...learn the architecture?**
→ Read `ARCHITECTURE.md` (10 min read)

**...deploy to production?**
→ Read `DEPLOYMENT.md` (15 min read)

**...get full technical details?**
→ Read `README_AUTH.md` (20 min read)

---

## 🎯 Key Features You Have

### ✅ User Authentication
- Registration with email validation
- Secure login with JWT
- Password hashing with bcrypt
- Account lockout protection

### ✅ Admin Dashboard
- Statistics overview
- User management (create, read, update, delete)
- Activity monitoring
- System logs

### ✅ Security
- Protected routes
- Protected API endpoints
- Role-based access control
- Best practices implemented

---

## 🗂️ Project Structure

```
Your Project/
├── server/                 Backend (Node.js/Express)
│   ├── controllers/       Business logic
│   ├── models/            Database schemas
│   ├── routes/            API endpoints
│   ├── middleware/        Auth & error handling
│   ├── utils/             Helper functions
│   └── .env.example       Configuration
│
├── client/                Frontend (React)
│   └── src/
│       ├── pages/         Page components
│       ├── components/    Reusable components
│       ├── services/      API calls
│       ├── contexts/      State management
│       ├── hooks/         Custom hooks
│       └── .env.example   Configuration
│
└── Documentation/
    ├── QUICKSTART.md      This guide
    ├── COMPLETE.md        What's included
    ├── ARCHITECTURE.md    System design
    ├── README_AUTH.md     Full docs
    └── DEPLOYMENT.md      Production guide
```

---

## 🔑 Demo Credentials

Use these to test the system:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Create New Test Account:**
- Go to `/register`
- Fill out the form
- Login with your credentials

---

## 🛠️ What Each Part Does

### Backend Server
- Handles user registration and login
- Manages authentication tokens (JWT)
- Provides admin dashboard data
- Manages user accounts and roles
- Stores data in MongoDB

### Frontend App
- Shows products to browse
- Provides login/register pages
- Shows admin dashboard
- Manages user interface
- Makes secure API calls

### Database
- Stores user accounts
- Stores product information
- Stores shopping carts
- Maintains activity logs

---

## ✨ Main Pages

### Public Pages (No Login Required)
- **Home** (`/`) - Browse products
- **Login** (`/login`) - Sign in to your account
- **Register** (`/register`) - Create new account

### Admin Pages (Login as Admin Required)
- **Dashboard** (`/admin/dashboard`) - See statistics
- **Users** (`/admin/users`) - Manage users
- **Activity** (`/admin/activity`) - View activity logs

---

## 🔒 How Security Works

1. **You register** → Password gets hashed
2. **You login** → Server creates a secure token
3. **Token is stored** → In your browser
4. **Each API call** → Includes your token
5. **Server verifies** → Token is valid & you have permission
6. **Response sent back** → Only if authorized

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Get the app running
2. Try logging in
3. Explore the admin dashboard
4. Read COMPLETE.md

### Intermediate
1. Read ARCHITECTURE.md
2. Look at the code structure
3. Understand the API endpoints
4. Try making API calls with Postman

### Advanced
1. Read README_AUTH.md for technical details
2. Read DEPLOYMENT.md for production setup
3. Customize the code
4. Deploy to production

---

## ⚠️ Important Configuration

### Before Running

**1. Make sure MongoDB is running:**
```powershell
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**2. Check environment files exist:**
- `server/.env.example` exists ✓
- `client/.env.example` exists ✓

These are created by setup script.

**3. Verify ports are available:**
- Port 5000 (Backend) - available?
- Port 5173 (Frontend) - available?
- Port 27017 (MongoDB) - available?

---

## 🆘 Quick Troubleshooting

### "MongoDB connection error"
```
→ Make sure mongod is running
→ Check MongoDB is installed
→ Verify connection string in server/.env
```

### "CORS error in browser"
```
→ Frontend and backend must be running
→ Check VITE_API_URL in client/.env
→ Verify it matches backend URL
```

### "Login not working"
```
→ Check MongoDB is running
→ Verify credentials (admin@example.com / admin123)
→ Check server is running (npm run dev)
→ Look at server console for errors
```

### "Admin dashboard not visible"
```
→ Make sure you're logged in as admin
→ Check login succeeded (look for redirect)
→ Try clearing browser cache
→ Check token is in localStorage
```

For more help: See `QUICKSTART.md` or `README_AUTH.md`

---

## 🚀 Next: Run the Setup

```powershell
# Windows
.\setup.bat

# Mac/Linux
./setup.sh
```

Then follow the on-screen instructions.

---

## 📚 Documentation Files

All documentation is in your project folder:

| File | Purpose | Read Time |
|------|---------|-----------|
| **QUICKSTART.md** | Setup & reference | 5 min |
| **COMPLETE.md** | What's included | 5 min |
| **ARCHITECTURE.md** | System design | 10 min |
| **README_AUTH.md** | Full technical docs | 20 min |
| **DEPLOYMENT.md** | Production setup | 15 min |

---

## 💡 Pro Tips

1. **Use demo account first** to understand the system
2. **Read ARCHITECTURE.md** to understand how it works
3. **Check browser console** if something isn't working
4. **Keep MongoDB running** while testing
5. **Clear cache** if login issues occur
6. **Check .env files** before running

---

## 🎉 You're Ready!

Everything is set up and ready to go.

**Next Step:** Run `.\setup.bat` or `./setup.sh`

Then start the backend and frontend servers.

---

## 📞 Quick Reference

**Backend starts on:** `http://localhost:5000`
**Frontend starts on:** `http://localhost:5173`
**Admin dashboard:** `http://localhost:5173/admin/dashboard`
**Demo email:** `admin@example.com`
**Demo password:** `admin123`

---

## ✅ Quick Checklist

- [ ] Run setup script
- [ ] Start MongoDB
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Open `http://localhost:5173`
- [ ] Login with demo credentials
- [ ] Explore the admin dashboard
- [ ] Read `COMPLETE.md` to learn more

---

**Happy coding! 🚀**

Your authentication system is production-ready and waiting to be used.
