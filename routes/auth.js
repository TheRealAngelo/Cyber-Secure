const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Add this GET handler for browser access
router.get('/register', (req, res) => {
  res.status(200).send(`
    <h1>Registration API</h1>
    <p>This endpoint requires a POST request with username, email, and password in the request body.</p>
    <p>Example:</p>
    <pre>
    {
      "username": "testuser",
      "email": "test@example.com", 
      "password": "testpassword"
    }
    </pre>
  `);
});

// Your existing routes
router.post('/login', loginLimiter, validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;