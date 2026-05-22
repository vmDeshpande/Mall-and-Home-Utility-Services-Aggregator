# Backend Deployment Guide

## Overview
The backend is a Node.js Express server that needs to be deployed separately from the frontend (which is on Vercel). We recommend using **Render.com** for easy deployment.

## Prerequisites
1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. Cloudinary account (free tier available at https://cloudinary.com)
3. GitHub repository with this code
4. Render account (https://render.com)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Create a database user with a password
4. Get your connection string: `mongodb+srv://username:password@cluster0.mongodb.net/servicehub`
5. Add your Render deployment IP to the IP whitelist (or use 0.0.0.0/0 for testing)

## Step 2: Set Up Cloudinary (Optional but Recommended)

1. Go to https://cloudinary.com and sign up
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret

## Step 3: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. Go to https://render.com and sign up
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Fill in the deployment settings:
   - **Name**: `mall-home-utility-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Region**: `Oregon` (or closest to you)
   - **Plan**: `Free`

5. Click "Advanced" and add the following environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `CLIENT_URL`: `https://your-vercel-domain.vercel.app`
   - `JWT_SECRET`: A long random string (generate one)
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `API_KEY`: Your Cloudinary API key
   - `API_SECRET`: Your Cloudinary API secret
   - `PORT`: `5000` (will be overridden by Render)

6. Click "Deploy Web Service"

### Option B: Using render.yaml (Advanced)

The `backend/render.yaml` file is already configured. You can commit it to GitHub and Render will auto-detect it.

## Step 4: Update Frontend Configuration

After the backend is deployed on Render, you'll get a URL like `https://mall-home-utility-backend.onrender.com`.

1. In Vercel dashboard, go to your project settings
2. Add environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
3. Redeploy the frontend

## Troubleshooting

### Backend shows 502 Bad Gateway
- Check MongoDB connection string is correct
- Verify environment variables are set
- Check render logs for detailed errors

### Frontend still connects to localhost:5000
- Make sure `NEXT_PUBLIC_API_URL` environment variable is set in Vercel
- Redeploy the frontend after setting the variable
- Clear browser cache

### CORS errors
- Verify `CLIENT_URL` in backend environment matches your Vercel domain
- Update CORS settings in `backend/server.js` if needed

## Local Development

1. Copy `.env.example` to `.env` in the backend folder
2. Fill in your local MongoDB URI and Cloudinary credentials
3. Run `npm install` in the backend folder
4. Run `npm run dev` to start the backend on port 5000

The frontend will automatically connect to `http://localhost:5000/api` in development mode.

## Production Environment Variables

After deployment, make sure these are set:

**Render Backend:**
- `MONGO_URI` - MongoDB Atlas connection string
- `CLIENT_URL` - Vercel frontend URL
- `JWT_SECRET` - Random secret key
- `CLOUD_NAME` - Cloudinary cloud name
- `API_KEY` - Cloudinary API key
- `API_SECRET` - Cloudinary API secret

**Vercel Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend URL (e.g., `https://backend.onrender.com/api`)
