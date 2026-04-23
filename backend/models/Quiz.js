// Quiz model for assignments and quizzes
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        questionText: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ['multiple-choice', 'true-false', 'short-answer'],
          default: 'multiple-choice',
        },
        options: [String], // For multiple choice questions
        correctAnswer: String, // Index for multiple choice or true/false value
        explanation: String,
        points: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPoints: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    duration: {
      type: Number, // in minutes
      default: 30,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Calculate total points before saving
quizSchema.pre('save', function (next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
