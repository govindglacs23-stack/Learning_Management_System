// Quiz controller
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create quiz (instructor only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, courseId, questions, passingScore, duration, maxAttempts } = req.body;

    if (!title || !courseId || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, courseId, and questions',
      });
    }

    // Verify course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create quiz for this course',
      });
    }

    // Add IDs to questions if not present
    const formattedQuestions = questions.map((q) => ({
      ...q,
      _id: q._id || new mongoose.Types.ObjectId(),
    }));

    const quiz = await Quiz.create({
      title,
      description,
      course: courseId,
      instructor: req.user._id,
      questions: formattedQuestions,
      passingScore,
      duration,
      maxAttempts,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all quizzes for a course
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({ course: courseId })
      .populate('instructor', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single quiz
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('instructor', 'name email avatar');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update quiz (instructor only)
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (quiz.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz',
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (quiz.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = [];

    quiz.questions.forEach((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      let isCorrect = false;
      if (studentAnswer && studentAnswer.selectedAnswer === question.correctAnswer) {
        isCorrect = true;
        score += question.points || 1;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: studentAnswer?.selectedAnswer || '',
        isCorrect,
      });
    });

    // Save attempt to enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: quiz.course,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    enrollment.quizAttempts.push({
      quizId: quiz._id,
      score,
      maxScore: quiz.totalPoints,
      answers: processedAnswers,
    });

    await enrollment.save();

    const percentage = (score / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    res.status(200).json({
      success: true,
      score,
      maxScore: quiz.totalPoints,
      percentage: Math.round(percentage),
      passed,
      answers: processedAnswers,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get quiz attempts for student
exports.getQuizAttempts = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      attempts: enrollment.quizAttempts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Publish quiz
exports.publishQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (quiz.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    quiz.isPublished = true;
    await quiz.save();

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
