// Quiz routes
const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getCourseQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizAttempts,
  publishQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/course/:courseId', getCourseQuizzes);
router.get('/:id', getQuiz);

// Protected routes
router.post('/', protect, createQuiz);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/course/:courseId/attempts', protect, getQuizAttempts);
router.put('/:id/publish', protect, publishQuiz);

module.exports = router;
