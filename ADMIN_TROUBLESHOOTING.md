# Admin Dashboard - Troubleshooting Guide

## Issue: Cannot open admin dashboard

### Quick Checklist

1. **Are you logged in as an ADMIN?**
   - Only users with `role: 'admin'` can access the admin panel
   - Demo credentials: `admin@example.com` / `admin123`

2. **Check browser console for errors:**
   - Press F12 to open DevTools
   - Look for red errors in the Console tab
   - Common errors:
     - "No token provided" → Need to login first
     - "Insufficient permissions" → User is not an admin
     - "Failed to fetch" → Backend server not running

3. **Verify backend is running:**
   ```powershell
   cd "c:\Users\deept\Desktop\guvi assingments\fakestore-cart-app\server"
   npm run dev
   # Should show: "Server running on port 5000"
   ```

4. **Verify frontend is running:**
   ```powershell
   cd "c:\Users\deept\Desktop\guvi assingments\fakestore-cart-app\client"
   npm run dev
   # Should show: "Local: http://localhost:5173"
   ```

5. **Login with correct admin account:**
   - Go to http://localhost:5173/login
   - Email: `admin@example.com`
   - Password: `admin123`
   - Click "Sign In"

6. **Navigate to admin dashboard:**
   - After login, you should see "Admin" button in navbar (purple button)
   - OR go directly to http://localhost:5173/admin/dashboard

### If Still Not Working

Check the actual user role in MongoDB:
```bash
# Connect to MongoDB and check
db.users.find({ email: "admin@example.com" }, { role: 1 })
# Should show: { "role": "admin" }
```

### Fix: Make a user admin

If the user exists but is not an admin, update their role:
```javascript
// In MongoDB or via admin API if you have update endpoints
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## What's Available in Admin Dashboard

✓ **Dashboard** - Statistics and overview
✓ **Users** - Manage users, toggle status, change roles
✓ **Activity** - View user activity and system logs

## Access URLs

- Dashboard: http://localhost:5173/admin/dashboard
- Users: http://localhost:5173/admin/users
- Activity: http://localhost:5173/admin/activity

---

**Still having issues?** Check the browser console (F12) for specific error messages and share them for debugging.
