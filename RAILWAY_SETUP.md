# Railway Setup Guide for Banisa Medical Platform

## Step 1: Add PostgreSQL Database (2 minutes)

1. Open your Railway project: https://railway.app
2. Click **"+ New"** button
3. Select **"Database"** → **"Add PostgreSQL"**
4. Done! Railway creates the database and `DATABASE_URL` automatically

## Step 2: Add Environment Variables (3 minutes)

1. Click on your **"server"** service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add each one below:

### Copy and paste these variables:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=3089c63a921671b5f3f7c417692edd441ed14e4985faac235e34b27b28da36923bc4b5c56f2a9873261dbddc9577d3455426e6d97e1a362f4e74d767d3144e29
JWT_ACCESS_SECRET=3f5219f38841f14a1734b667a01b2d2ac3ebdb1ec58000e6587270fe1b210e969ba1156405f70648c8972f214e05dccebd17872748ab8fd041341e32dbf3626c
JWT_REFRESH_SECRET=0eb5bf9fb6f6bd6901b9570b932ded9dac71e8992d1fe208f4a3fc3ad3c3d36d3df9c6caa2cebfd3ecd2cafbfee257d1ac37dd1bb9429def34edbe1c182ae3da
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### Optional - If you want image uploads (Cloudinary):

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Get free Cloudinary account at: https://cloudinary.com/users/register/free

## Step 3: Connect Database to Service

1. In the **"Variables"** tab of your **"server"** service
2. Look for `DATABASE_URL` - it should already be there (linked from PostgreSQL)
3. If not there, click **"+ New Variable"** → **"Add Reference"** → Select PostgreSQL's `DATABASE_URL`

## Step 4: Deploy

Railway will automatically redeploy after you add the variables. Wait 2-3 minutes.

## Step 5: Check Deployment

1. Go to **"Deployments"** tab
2. Click **"View Logs"**
3. You should see:
   - ✅ "Prisma migrate deploy" - Database setup
   - ✅ "Server running on port 3000"

## Your Backend URL

Railway will give you a URL like: `https://server-production-xxxx.up.railway.app`

Find it in: **Settings** → **Networking** → **Public Networking** → **Generate Domain**

---

## Next: Deploy Frontend (Optional)

Your frontend is in the `code` folder. You can:

**Option A:** Deploy separately on Vercel
- Push `code` folder to GitHub
- Connect to Vercel
- Set environment variable: `VITE_API_URL=https://your-railway-backend-url.up.railway.app`

**Option B:** I can help you serve it from the same Railway backend

---

## Troubleshooting

**If deployment fails:**
- Check **"View Logs"** in Deployments tab
- Make sure PostgreSQL database is running
- Make sure all environment variables are added

**Database connection issues:**
- Verify `DATABASE_URL` is linked from PostgreSQL service
- Check PostgreSQL service is running (green checkmark)

---

Generated: Mar 11, 2026
Repository: https://github.com/wind86861-lab/server.git
