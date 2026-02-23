const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'Aquaverse Backend API',
    version: '1.0.0',
    status: 'operational',
    services: {
      ai: 'Genkit AI Integration',
      database: 'Ready',
      authentication: 'JWT Enabled'
    }
  });
});

// AI Diagnosis endpoint - Main feature
app.post('/api/diagnose', async (req, res) => {
  try {
    const { symptoms, imageData, userId } = req.body;

    // Validation
    if (!symptoms || symptoms.trim() === '') {
      return res.status(400).json({ 
        error: 'Symptoms description is required',
        success: false
      });
    }

    // Call Google Genkit API for AI diagnosis
    const diagnosis = await diagnoseDisease(symptoms, imageData);

    res.json({
      success: true,
      diagnosis: diagnosis,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({
      error: 'Failed to process diagnosis request',
      message: error.message,
      success: false
    });
  }
});

// Function to call Google Genkit AI for prawn disease diagnosis
async function diagnoseDisease(symptoms, imageData) {
  try {
    // This simulates the Genkit AI call
    // In production, connect to actual Google Genkit API
    const prompt = `
You are an expert aquaculture veterinarian specializing in prawn diseases.

Based on the following symptoms reported by the farmer, provide a comprehensive diagnosis including:
1. Probable disease(s)
2. Severity level (Mild, Moderate, Severe, Critical)
3. Recommended treatments
4. Prevention measures
5. Urgency level (Immediate action required, Soon, Can wait, Monitor)

Symptoms reported: ${symptoms}

Provide a JSON response with these fields: disease, severity, treatments, prevention, urgency, confidence_score`;

    // Simulate AI response (replace with actual Genkit API call)
    const diagnosis = {
      disease: "White Spot Disease (WSD)",
      severity: "Moderate",
      confidence_score: 0.85,
      treatments: [
        "Increase water aeration",
        "Maintain water temperature 28-30°C",
        "Use approved antimicrobial agents",
        "Remove affected prawns immediately"
      ],
      prevention: [
        "Regular water quality testing",
        "Proper quarantine procedures",
        "Maintain stocking density",
        "Regular health monitoring"
      ],
      urgency: "Soon",
      recommendations: "Monitor closely for 2-3 days. If condition worsens, escalate to veterinarian."
    };

    return diagnosis;
  } catch (error) {
    console.error('AI diagnosis error:', error);
    throw new Error('AI service temporarily unavailable');
  }
}

// User authentication endpoint
app.post('/api/auth/signup', (req, res) => {
  try {
    const { fullName, phone, age, profession } = req.body;

    // Validation
    if (!fullName || !phone) {
      return res.status(400).json({ 
        error: 'Full name and phone are required',
        success: false
      });
    }

    // Mock user creation
    const user = {
      id: `user_${Date.now()}`,
      fullName,
      phone,
      age,
      profession,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Signup failed',
      message: error.message,
      success: false
    });
  }
});

// User login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        success: false
      });
    }

    // Mock token generation
    const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      token: token,
      user: {
        id: `user_${Date.now()}`,
        email: email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
      success: false
    });
  }
});

// Prawn health data endpoint
app.get('/api/health-data/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock health data
    const healthData = {
      userId: userId,
      lastDiagnosis: new Date().toISOString(),
      history: [
        { date: '2026-02-20', status: 'Healthy', notes: 'Good water quality' },
        { date: '2026-02-15', status: 'Monitored', notes: 'Slight temperature fluctuation' }
      ]
    };

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch health data',
      message: error.message,
      success: false
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    success: false
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    success: false
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`⚡ Aquaverse Backend Server`);
  console.log(`⚡ Port: ${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡ AI Integration: Genkit (${process.env.GENKIT_MODEL})`);
  console.log(`⚡ Started: ${new Date().toISOString()}`);
  console.log(`========================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
