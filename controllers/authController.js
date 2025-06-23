const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(createError(409, 'Username or email already exists'));
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });
    
    await newUser.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    
    // Save refresh token to user document
    newUser.refreshToken = refreshToken;
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
    
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }
    
    // Check if account is locked
    if (user.accountLocked && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return next(createError(403, `Account is locked. Try again in ${remainingTime} minutes`));
    }
    
    // If lock time has expired, unlock the account
    if (user.accountLocked && user.lockUntil <= Date.now()) {
      user.accountLocked = false;
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Register failed attempt and save
      await user.registerLoginFailure();
      
      // Check if this attempt caused a lock
      if (user.accountLocked) {
        return next(createError(403, 'Too many failed login attempts. Account locked for 30 minutes'));
      }
      
      return next(createError(401, 'Invalid credentials'));
    }
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(createError(400, 'Refresh token is required'));
    }
    
    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return next(createError(401, 'Invalid or expired refresh token'));
    }
    
    // Find user with matching refresh token
    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    
    if (!user) {
      return next(createError(401, 'Invalid refresh token'));
    }
    
    // Generate new tokens
    const tokens = generateTokens(user._id);
    
    // Update refresh token in database
    user.refreshToken = tokens.refreshToken;
    await user.save();
    
    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
    
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(createError(400, 'Refresh token is required'));
    }
    
    // Find user with this refresh token and clear it
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { new: true }
    );
    
    if (!user) {
      return next(createError(400, 'Invalid refresh token'));
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (err) {
    next(err);
  }
};