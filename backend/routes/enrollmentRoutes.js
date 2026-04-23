// Enrollment routes
const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getStudentEnrollments,
  getEnrollmentDetails,
  updateProgress,
  getCourseEnrollments,
  issueCertificate,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

// Protected routes
router.post('/enroll', protect, enrollCourse);
router.get('/my-enrollments', protect, getStudentEnrollments);
router.get('/:courseId', protect, getEnrollmentDetails);
router.put('/:courseId/progress', protect, updateProgress);
router.get('/:courseId/students', protect, getCourseEnrollments);
router.post('/:courseId/certificate', protect, issueCertificate);

module.exports = router;
