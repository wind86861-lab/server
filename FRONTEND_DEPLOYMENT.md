# Frontend Deployment Guide for Banisa Medical Platform

## ✅ Backend Status
Your backend is running successfully on Railway!

## 🚀 Deploy Frontend on Railway

### Step 1: Create Frontend Service (2 minutes)

1. Go to your Railway project: https://railway.app
2. Click **"+ New"** → **"Deploy from GitHub repo"**
3. Select the same repository: **`wind86861-lab/server`**
4. **Important:** In the **"Root Directory"** field, type: **`code`**
5. Click **"Deploy"**

### Step 2: Expose Your Backend (1 minute)

1. Go to your **"server"** service (your backend)
2. Click **"Settings"** tab
3. Click **"Expose"** or **"Add Domain"**
4. Copy the public URL (like: `https://server-production-xxxx.up.railway.app`)

### Step 3: Connect Frontend to Backend (1 minute)

Your frontend is already configured! The nginx proxy will automatically:
- Serve the React app on port 80
- Proxy `/api/*` requests to your backend service

### Step 4: Wait for Deployment (2-3 minutes)

1. Go to the **"code"** service (your frontend)
2. Click **"Deployments"** tab
3. Click **"View Logs"** to monitor progress
4. You should see:
   - ✅ "Building frontend with Vite"
   - ✅ "Starting nginx server"

### Step 5: Get Your Frontend URL

1. Go to **"Settings"** tab of your **"code"** service
2. Click **"Expose"** or **"Add Domain"**
3. Copy the public URL

## 🎉 Result

You'll have:
- **Backend:** `https://server-production-xxxx.up.railway.app` (API)
- **Frontend:** `https://code-production-xxxx.up.railway.app` (React app)

## 🔧 How It Works

### Frontend Configuration
- **Base URL:** `/api` (in `src/services/api.js`)
- **Nginx Proxy:** Routes `/api/*` to backend service
- **Build:** Vite builds to `/dist`, served by nginx

### Service Communication
```
User → Frontend (nginx) → Backend (Express) → Database (PostgreSQL)
```

## 🛠️ Troubleshooting

### Frontend shows blank page
- Check deployment logs for build errors
- Make sure `code` directory was selected as root

### API calls fail (CORS errors)
- Verify backend service is running
- Check nginx proxy configuration
- Make sure backend service name is correct in nginx.conf

### Can't reach backend
- Ensure backend service is exposed
- Check Railway service networking
- Verify DATABASE_URL is configured

## 📱 Access Your App

Once both services are running:
1. Open your frontend URL
2. Try logging in or registering
3. The app should connect to your backend automatically

## 🔄 Development vs Production

- **Development:** Frontend runs on `localhost:5173`, backend on `localhost:3000`
- **Production:** Both run on Railway with nginx proxy handling API routing

---

Generated: Mar 11, 2026
Repository: https://github.com/wind86861-lab/server.git
Frontend Directory: `/code`
Backend Directory: `/backend`
