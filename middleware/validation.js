const { createError } = require('../utils/error');

exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  
  const errors = [];
  
  // Username validation
  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 4) {
    errors.push('Username must be at least 4 characters');
  }
  
  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Email is invalid');
  }
  
  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  // If there are validation errors, return them
  if (errors.length > 0) {
    return next(createError(400, 'Validation error', errors));
  }
  
  next();
};

exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  const errors = [];
  
  if (!username) {
    errors.push('Username is required');
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  if (errors.length > 0) {
    return next(createError(400, 'Validation error', errors));
  }
  
  next();
};