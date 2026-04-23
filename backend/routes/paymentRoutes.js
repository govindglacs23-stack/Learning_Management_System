// Payment Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    processPayment,
    getPaymentHistory,
    getPaymentDetails,
    requestRefund,
    getInstructorEarnings,
    updatePaymentStatus,
} = require('../controllers/paymentController');

// Student routes
router.post('/process', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/:paymentId', protect, getPaymentDetails);
router.post('/:paymentId/refund', protect, requestRefund);

// Instructor routes
router.get('/instructor/earnings', protect, getInstructorEarnings);

// Admin routes
router.put('/:paymentId/status', protect, updatePaymentStatus);

module.exports = router;
