// Course model
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    category: {
      type: String,
      enum: ['Programming', 'Design', 'Business', 'Development', 'Other'],
      default: 'Programming',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/300x200',
    },
    price: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
    videos: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        description: String,
        videoUrl: String,
        duration: Number, // in minutes
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        comments: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            userName: String,
            text: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    resources: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: {
          type: String,
          required: [true, 'Please provide a resource title'],
        },
        type: {
          type: String,
          enum: ['video', 'pdf', 'document', 'other'],
          default: 'other',
        },
        url: {
          type: String,
          required: [true, 'Please provide a resource URL'],
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lessons: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
          type: String,
          enum: ['video', 'pdf', 'document', 'other'],
          default: 'video',
          required: true,
        },
        title: {
          type: String,
          required: [true, 'Lesson title required'],
        },
        url: {
          type: String,
          required: [true, 'Lesson URL required'],
        },
        thumbnail: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          default: '',
        },
        duration: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    totalStudents: {
      type: Number,
      default: 0,
    },
    // Payment Options
    paymentType: {
      type: String,
      enum: ['free', 'paid', 'premium'],
      default: 'free',
    },
    paymentMethods: [
      {
        type: String,
        enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer'],
      },
    ],
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
      default: 'USD',
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    discountExpiry: {
      type: Date,
      default: null,
    },
    refundPolicy: {
      type: String,
      enum: ['no_refund', '7_days', '14_days', '30_days'],
      default: '14_days',
    },
    certificateAvailable: {
      type: Boolean,
      default: true,
    },
    certificatePrice: {
      type: Number,
      default: 0,
    },
    isPaymentRequired: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
