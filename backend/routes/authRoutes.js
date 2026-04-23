// Authentication routes
const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, debugUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/debug/users', debugUsers);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
