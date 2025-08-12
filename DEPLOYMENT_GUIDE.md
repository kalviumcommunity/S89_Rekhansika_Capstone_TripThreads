# TripThreads Deployment Guide

## Changes Made for Deployment

### Backend Changes
1. **Environment Configuration (.env)**
   - Updated `callbackURL` to use deployed backend URL
   - Set `FRONTEND_URL` placeholder for your frontend domain
   - Backend now uses `PORT` environment variable for deployment platforms

2. **Server Configuration (server.js)**
   - Added `PORT` environment variable support
   - Enhanced CORS configuration with better logging

### Frontend Changes
1. **Environment Configuration**
   - Created `.env` file with `VITE_API_BASE_URL`
   - Created `src/config/api.js` for centralized API URL management

2. **API Calls Updated**
   - All hardcoded `localhost:3000` URLs replaced with `API_BASE_URL`
   - Updated components: Login, Signup, Home, Profile, Experience, FollowOthers, UserPosts, Bookings, ChatbotAI

## Deployment Steps

### Backend Deployment (Already Done)
Your backend is deployed at: `https://s89-rekhansika-capstone-tripthreads-1.onrender.com/`

### Frontend Deployment
1. **Update Environment Variables**
   - The `.env` file is already configured with your backend URL

2. **Build and Deploy Frontend**
   ```bash
   cd frontend
   npm run build
   ```
   - Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

### Environment Variables Summary

**Backend (.env):**
```
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
callbackURL=https://s89-rekhansika-capstone-tripthreads-1.onrender.com/auth/google/callback
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=https://your-frontend-domain.com
EMAIL_PASS=your_email_app_password
EMAIL_USER=your_email_address
PORT=3000
```

**Frontend (.env):**
```
VITE_API_BASE_URL=https://s89-rekhansika-capstone-tripthreads-1.onrender.com
```

## Important Security Note
- Never commit actual API keys, passwords, or secrets to version control
- Use environment variables for all sensitive information
- Keep your .env files in .gitignore

Your project is now deployment ready! 🚀
