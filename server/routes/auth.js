const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Debugger (toggle with DEBUG=true)
const debug = process.env.DEBUG === 'true';

// Unified error response
const handleError = (res, status, message, error = null) => {
  if (debug && error) console.error('[DEBUG] Error:', error.stack);
  return res.status(status).json({ error: message });
};

// --- REGISTRATION ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return handleError(res, 400, 'Email and password required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // Check existing user
    if (await User.exists({ email: cleanEmail })) {
      return handleError(res, 400, 'Email already registered');
    }

    // Hash password with modern algorithm
    const hashedPassword = await bcrypt.hash(cleanPassword, 12);

    // Create user with explicit schema
    const user = await User.create({
      name: name?.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'therapist'
    });

    // Generate JWT with secure settings
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256' // Explicitly specify algorithm
      }
    );

    // Secure response (exclude sensitive fields)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userResponse
    });

  } catch (err) {
    return handleError(res, 500, 'Registration failed', err);
  }
});
router.get('/debug-users', async (req, res) => {
    const users = await User.find({}).lean();
    res.json(users);
  });
// --- LOGIN --- 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email?.trim() || !password?.trim()) {
      return handleError(res, 400, 'Email and password required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // Find user with case-insensitive email
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') }
    }).select('+password'); // Ensure password field is returned

    if (!user) {
      if (debug) console.log(`[DEBUG] User not found: ${cleanEmail}`);
      return handleError(res, 401, 'Invalid credentials');
    }

    // Password comparison with timing-safe check
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    
    if (!isMatch) {
      if (debug) {
        console.log('[DEBUG] Password mismatch for:', cleanEmail);
        console.log(`Input: ${cleanPassword}\nStored: ${user.password}`);
      }
      return handleError(res, 401, 'Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256'
      }
    );

    // Secure response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (err) {
    return handleError(res, 500, 'Login failed', err);
  }
});

module.exports = router;