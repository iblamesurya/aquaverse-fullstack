# Aquaverse Migration Guide

## Overview
This document outlines the migration process for setting up the new Aquaverse full-stack application with separated frontend and backend.

## Current Status
- ✅ Frontend code exists in old repo (aquaverseeee)
- ❌ Backend was deleted
- ✅ New repo created (aquaverse-fullstack)

## Quick Setup Steps

### Option 1: Using Git CLI (Recommended)

Run these commands in your terminal:

```bash
# Clone the new repository
git clone https://github.com/iblamesurya/aquaverse-fullstack.git
cd aquaverse-fullstack

# Clone the old frontend code into frontend folder
git clone https://github.com/iblamesurya/aquaverseeee.git frontend

# Create backend folder structure
mkdir backend
cd backend
npm init -y

# Install essential backend dependencies
npm install express cors dotenv axios
npm install -D nodemon

# Create basic server file
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
EOF

# Add start script to package.json
npm set-script start "node server.js"
npm set-script dev "nodemon server.js"

cd ..

# Commit everything
git add .
git commit -m "feat: Add frontend and backend structure"
git push origin main
```

### Option 2: Manual Upload

If CLI is not available, use GitHub web interface:

1. Create `backend/package.json` manually
2. Create `backend/server.js` with basic Express setup
3. Transfer frontend files from aquaverseeee repo

## Backend Server Structure (To Create)

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
├── routes/            # API routes
│   ├── auth.js
│   ├── users.js
│   └── diagnose.js
├── controllers/       # Business logic
├── models/            # Data models
└── middleware/        # Custom middleware
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PROD_URL=https://aquaverse-api.onrender.com
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_db_url
JWT_SECRET=your_jwt_secret
API_KEY_GENKIT=your_genkit_key
```

## Deployment Plan

### Frontend Deployment (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend/`
3. Deploy

### Backend Deployment (Render.com)
1. Create account on render.com
2. New "Web Service" from GitHub
3. Set root directory to `backend/`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

## Next Steps
1. Execute git commands above
2. Test locally: `npm run dev` in both frontend and backend
3. Deploy frontend to Vercel
4. Deploy backend to Render
5. Update environment variables in frontend to point to live backend
