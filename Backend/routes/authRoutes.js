const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../Controllers/authController');
const { protect } = require('../Middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (private)
router.get('/me', protect, getMe);

// PUT /api/auth/me  (private)
router.put('/me', protect, updateProfile);

module.exports = router;
