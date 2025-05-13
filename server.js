require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Get local IP address for network sharing
const { getLocalIpAddress } = require('./utils');
const LOCAL_IP = getLocalIpAddress();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lofi-app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteStations: [{ type: String }], // Array of station IDs
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'lofi-secret-key',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favoriteStations: user.favoriteStations
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'lofi-secret-key',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favoriteStations: user.favoriteStations
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lofi-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get current user
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add favorite station
app.post('/api/favorites', auth, async (req, res) => {
  try {
    const { stationId } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if station is already in favorites
    if (user.favoriteStations.includes(stationId)) {
      return res.status(400).json({ message: 'Station already in favorites' });
    }
    
    user.favoriteStations.push(stationId);
    await user.save();
    
    res.json(user.favoriteStations);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove favorite station
app.delete('/api/favorites/:stationId', auth, async (req, res) => {
  try {
    const { stationId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove station from favorites
    user.favoriteStations = user.favoriteStations.filter(id => id !== stationId);
    await user.save();
    
    res.json(user.favoriteStations);
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get favorite stations
app.get('/api/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.favoriteStations);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from the React app build directory
const path = require('path');
const frontendPath = path.join(__dirname, 'lofi-spin-vibes-menu-main/dist');

// Check if the frontend build directory exists
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  console.log(`Serving frontend from: ${frontendPath}`);
  
  // Serve static files from the dist directory
  app.use(express.static(frontendPath));
  
  // Handle routes for the frontend app
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  // Catch-all route for client-side routing
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.warn(`Frontend build directory not found at: ${frontendPath}`);
  console.warn('Please build the frontend app first with: cd lofi-spin-vibes-menu-main && npm run build');
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://${LOCAL_IP}:${PORT}/api`);
  console.log(`\n✅ SHAREABLE LINK: http://${LOCAL_IP}:${PORT}\n`);
  console.log('Server is now accessible from other devices on your network');
  console.log('Share this link with devices connected to the same WiFi/network');
});