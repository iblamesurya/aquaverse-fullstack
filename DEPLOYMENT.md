# Aquaverse Full-Stack Deployment Guide

## Project Overview

Aquaverse is a full-stack aquaculture disease diagnosis and management platform with:
- **Frontend**: Next.js React app (Vercel)
- **Backend**: Node.js/Express API with Google Genkit AI (Render/Railway)
- **AI Features**: Prawn disease diagnosis using Google's Genkit AI

## Complete Setup Instructions

### Step 1: Clone and Prepare the Repository

```bash
# Clone the new repository
git clone https://github.com/iblamesurya/aquaverse-fullstack.git
cd aquaverse-fullstack

# Clone the frontend code from the old repository
git clone https://github.com/iblamesurya/aquaverseeee.git frontend

# Remove git history from frontend (optional)
cd frontend
rm -rf .git
cd ..
```

### Step 2: Set Up Environment Variables

#### Backend .env Setup

1. Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` with your actual values:

```
# Server Configuration
PORT=5000
NODE_ENV=production
HOST=0.0.0.0

# Frontend URLs (update to your domain)
FRONTEND_URL=http://localhost:3000
FRONTEND_PROD_URL=https://aquaverse.vercel.app

# AI Configuration - Google Genkit
GENKIT_API_KEY=your_google_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GENKIT_MODEL=gemini-1.5-pro

# Authentication
JWT_SECRET=your_very_secure_random_key_change_this
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://aquaverse.vercel.app

# Other settings
LOG_LEVEL=info
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
API_DOCS_ENABLED=true
```

#### Frontend .env.local Setup

1. Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PRODUCTION_URL=https://aquaverse-api.onrender.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_GENKIT_API_KEY=your_google_api_key_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_ENABLE_AI_DIAGNOSIS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Step 3: Local Testing

#### Install and Run Backend

```bash
cd backend
npm install
npm run dev
# Server should start on http://localhost:5000
```

#### Install and Run Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend should start on http://localhost:3000
```

#### Test AI Diagnosis Feature

```bash
# Test the diagnosis endpoint
curl -X POST http://localhost:5000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"symptoms":"white spots on prawns, lethargy, reduced feeding"}'
```

### Step 4: Backend Deployment (Render.com)

#### Create Render Account and Deploy Backend

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure deployment:
   - **Name**: aquaverse-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. Add Environment Variables in Render Settings:
   - Copy all values from your `backend/.env` file
   - **CRITICAL**: Update FRONTEND_PROD_URL to your Vercel app URL

6. Deploy and get the URL (e.g., `https://aquaverse-api.onrender.com`)

### Step 5: Frontend Deployment (Vercel)

#### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import GitHub repository: `aquaverse-fullstack`
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_PRODUCTION_URL=https://aquaverse-api.onrender.com` (from Step 4)
     - `NEXT_PUBLIC_GENKIT_API_KEY=your_key`
     - `NEXT_PUBLIC_GOOGLE_API_KEY=your_key`

5. Deploy and get the URL (e.g., `https://aquaverse.vercel.app`)

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Update environment variable:
   - `FRONTEND_PROD_URL=https://aquaverse.vercel.app` (your actual Vercel URL)
   - `CORS_ORIGIN=https://aquaverse.vercel.app`
3. Redeploy backend

## Getting Google API Keys for AI Features

### For Google Genkit AI:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Vertex AI API
   - Generative Language API
4. Create Service Account and get JSON key
5. Use the API key in `GENKIT_API_KEY` environment variable

## Verifying AI Features Work

### Test from Frontend

1. Navigate to the app: https://aquaverse.vercel.app
2. Sign up/Login
3. Go to diagnosis section
4. Enter symptoms: "white spots on prawns, lethargy, slow movement"
5. Submit - should get AI diagnosis response

### Test from Backend API

```bash
curl -X POST https://aquaverse-api.onrender.com/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "white spots on body, lethargy, reduced appetite",
    "userId": "test_user_123"
  }'
```

Expected response:
```json
{
  "success": true,
  "diagnosis": {
    "disease": "White Spot Disease (WSD)",
    "severity": "Moderate",
    "confidence_score": 0.85,
    "treatments": [...],
    "prevention": [...],
    "urgency": "Soon"
  }
}
```

## Backend API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api/status` - API status with service info

### AI Features
- `POST /api/diagnose` - Prawn disease diagnosis
  ```json
  {
    "symptoms": "description of symptoms",
    "imageData": "optional base64 image",
    "userId": "user_id"
  }
  ```

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Health Data
- `GET /api/health-data/:userId` - Get user's health history

## Troubleshooting

### Backend not connecting to frontend
- Check CORS_ORIGIN environment variable
- Verify frontend URL matches exactly
- Ensure .env.local in frontend has correct API_URL

### AI diagnosis not working
- Verify GENKIT_API_KEY is set correctly
- Check Google Cloud API is enabled
- Test with curl command above
- Check backend logs on Render

### Frontend can't connect to API
- Verify NEXT_PUBLIC_API_PRODUCTION_URL in frontend env
- Ensure backend is running and accessible
- Check browser console for CORS errors
- Verify backend CORS settings include frontend URL

## Monitoring

### Render Backend Logs
- Go to Render dashboard → aquaverse-api → Logs
- Watch for errors in real-time

### Vercel Frontend Analytics
- Go to Vercel dashboard → aquaverse → Analytics
- Monitor performance metrics

## Summary of Services

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | https://aquaverse.vercel.app | ✅ Deployed |
| Backend API | Render | https://aquaverse-api.onrender.com | ✅ Deployed |
| AI Engine | Google Genkit | via backend | ✅ Integrated |
| Repository | GitHub | https://github.com/iblamesurya/aquaverse-fullstack | ✅ Ready |

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs on Render
3. Check frontend console in browser (F12)
4. Verify all environment variables are set correctly
