// Enrollment model for tracking student progress
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    videosWatched: [
      {
        videoId: mongoose.Schema.Types.ObjectId,
        watchedAt: {
          type: Date,
          default: Date.now,
        },
        duration: Number, // watched duration in seconds
      },
    ],
    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    quizAttempts: [
      {
        quizId: mongoose.Schema.Types.ObjectId,
        score: Number,
        maxScore: Number,
        attemptDate: {
          type: Date,
          default: Date.now,
        },
        answers: [
          {
            questionId: mongoose.Schema.Types.ObjectId,
            selectedAnswer: String,
            isCorrect: Boolean,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed'],
      default: 'enrolled',
    },
    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'unpaid', 'refunded'],
      default: 'unpaid',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer', 'free'],
      default: 'free',
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateIssuedDate: {
      type: Date,
    },
    certificatePaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index to ensure one enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
