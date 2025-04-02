require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Debug: Verify paths
console.log('Current directory:', __dirname);
console.log('Environment variables loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');

// Import routes with proper error handling
let authRoutes;
try {
  // First try the exact path you're using
  authRoutes = require('.\\routes\\auth');
  console.log('Successfully loaded auth routes from ./routes/auth');
} catch (err) {
  console.error('Failed to load auth routes:', err.message);
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Database connection with improved error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server with better logging
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on port ${PORT}`);
  console.log(`Database: ${mongoose.connection.host || 'Not connected'}`);
});

// Enhanced error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});