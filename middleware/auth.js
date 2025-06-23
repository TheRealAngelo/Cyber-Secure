const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'No token provided'));
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(createError(401, 'Invalid token'));
      }
      
      // Attach user to request
      req.user = user;
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expired'));
      }
      return next(createError(401, 'Invalid token'));
    }
  } catch (err) {
    next(err);
  }
};