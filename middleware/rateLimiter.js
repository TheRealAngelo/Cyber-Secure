const rateLimit = require('express-rate-limit');

// Specific limiter for login attempts - stronger protection
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP, please try again later' },
  skipSuccessfulRequests: true, // only failed login attempts count towards rate limit
});

// Limiter for registration - prevent spam account creation
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 account creations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this IP, please try again later' }
});