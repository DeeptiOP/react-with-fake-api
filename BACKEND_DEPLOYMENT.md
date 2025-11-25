# Backend Deployment Guide

## 🚀 Quick Start - Deploy to Render (Recommended)

### Step 1: Set Up MongoDB Cloud Database

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up** (free account)
3. **Create a Cluster**:
   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select region closest to you
   - Click "Create"
4. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Drivers"
   - Copy the connection string:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/fakestore-app
     ```
   - Replace `username`, `password` with your credentials

---

### Step 2: Deploy Backend to Render

1. **Go to Render**: https://render.com
2. **Sign up with GitHub** (use Biswapriti account)
3. **Create Web Service**:
   - Click "New +" button
   - Select "Web Service"
   - Connect GitHub repo: `Biswapriti/online-store-with-api`
4. **Configure Service**:
   - **Name**: `online-store-backend`
   - **Region**: Oregon (or your preference)
   - **Root Directory**: Leave empty (Render will auto-detect)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Plan**: Free
5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   | Key | Value |
   |-----|-------|
   | MONGODB_URI | mongodb+srv://username:password@cluster.mongodb.net/fakestore-app |
   | JWT_SECRET | your_super_secret_key_here_change_this |
   | JWT_EXPIRE | 7d |
   | NODE_ENV | production |
   | BCRYPT_ROUNDS | 10 |
   | PORT | 5000 |

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Get your backend URL: `https://online-store-backend.onrender.com`

---

## 🔗 Update Frontend with Backend URL

After deployment, update your frontend to use the new backend URL:

### In `client/.env`:
```env
VITE_API_URL=https://online-store-backend.onrender.com/api
```

Or if using Netlify:
1. Go to Netlify Dashboard
2. Site Settings → "Build & deploy"
3. Environment → "Edit variables"
4. Add:
   ```
   VITE_API_URL=https://online-store-backend.onrender.com/api
   ```
5. Trigger redeploy

---

## 📋 Alternative Platforms

### Railway (Also Free)
1. Go to https://railway.app
2. Create account with GitHub
3. "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables (same as above)
6. Deploy automatically

### Vercel (For Serverless)
1. Go to https://vercel.com
2. Import Git repository
3. Configure with environment variables
4. Deploy

### Heroku (Most Reliable but Paid)
1. Go to https://heroku.com
2. Create app: `online-store-backend`
3. Connect GitHub
4. Add buildpacks for Node.js
5. Add config vars (environment variables)
6. Deploy

---

## ✅ Testing Your Deployed Backend

After deployment, test these endpoints:

```bash
# Test health check
curl https://online-store-backend.onrender.com/api/health

# Test login
curl -X POST https://online-store-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test admin dashboard stats
curl https://online-store-backend.onrender.com/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 Important Security Notes

**Before Going Live:**

1. **Change JWT_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Use the output as your JWT_SECRET

2. **Use Strong Database Password**
   - Create a strong MongoDB password (20+ characters)
   - Don't use simple passwords

3. **Enable HTTPS**
   - All platforms above provide free HTTPS
   - Make sure `NODE_ENV=production`

4. **Set Up CORS for Frontend**
   - Update `server.js` to allow your Netlify domain:
   ```javascript
   app.use(cors({
     origin: 'https://your-netlify-domain.netlify.app'
   }));
   ```

5. **Monitor Logs**
   - Check deployment logs regularly
   - Look for errors in production

---

## 📊 Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Environment variables set correctly
- [ ] Frontend .env updated with backend URL
- [ ] Frontend redeployed to Netlify
- [ ] Test login works end-to-end
- [ ] Admin dashboard loads data from live API
- [ ] CORS properly configured
- [ ] JWT_SECRET is strong and secret
- [ ] Error logs monitored

---

## 🆘 Troubleshooting

### "Failed to connect to MongoDB"
- Check MONGODB_URI is correct
- Verify MongoDB Atlas IP whitelist (should be 0.0.0.0/0 for testing)
- Check username/password in connection string

### "CORS error in browser"
- Update CORS origin in `server.js`
- Redeploy backend with new CORS settings

### "Cannot read token"
- Check JWT_SECRET is set in environment variables
- Make sure Authorization header is sent correctly

### "API returns 401 Unauthorized"
- Token might be expired
- Check if token was generated with correct secret
- Verify backend is using same JWT_SECRET as before

---

## 💡 Monitoring & Maintenance

### Check Backend Logs
- **Render**: Click service → "Logs" tab
- **Railway**: Click service → "Logs"
- **Heroku**: `heroku logs --tail`

### View Live Metrics
- **Render**: Service dashboard shows CPU, memory
- **Railway**: Real-time metrics available

### Redeploy After Changes
1. Push changes to GitHub
2. Platform auto-detects and rebuilds
3. Or manually trigger rebuild in dashboard

---

## 🎉 Success!

Once deployed, you have:
- ✅ Frontend on Netlify
- ✅ Backend on Render/Railway
- ✅ Database on MongoDB Atlas
- ✅ All connected and working together

Your e-commerce app is now **live on the internet**! 🚀
