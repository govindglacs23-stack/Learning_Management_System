// Course routes
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addVideo,
  deleteVideo,
  publishCourse,
  addVideoComment,
  addResource,
  deleteResource,
  addLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/courseController');
const { protect, isInstructor } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourse);

// Seed sample courses (development only)
router.post('/seed/sample-courses', async (req, res) => {
  try {
    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      return res.status(400).json({
        success: false,
        message: 'Sample courses already exist',
      });
    }

    // Create or get default instructor
    let instructor = await User.findOne({ email: 'instructor@example.com' });
    if (!instructor) {
      instructor = await User.create({
        name: 'John Instructor',
        email: 'instructor@example.com',
        password: 'password123',
        role: 'instructor',
      });
    }

    const sampleCourses = [
      {
        title: 'React.js Fundamentals',
        description: 'Learn the basics of React.js including components, props, state, and hooks. Perfect for beginners who want to start web development with React.',
        category: 'Programming',
        level: 'Beginner',
        duration: 20,
        price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1633356713697-d3e7e9e17a9e?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Introduction to React',
            description: 'Get started with React basics',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Components and Props',
            description: 'Understanding components and props',
            duration: 60,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'State and Hooks',
            description: 'Managing state with hooks',
            duration: 75,
          },
        ],
      },
      {
        title: 'JavaScript Mastery',
        description: 'Complete JavaScript course covering ES6+, async programming, promises, and more. Build strong foundations in JavaScript.',
        category: 'Programming',
        level: 'Intermediate',
        duration: 35,
        price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'ES6 Basics',
            description: 'Modern JavaScript syntax',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Async Programming',
            description: 'Understanding callbacks, promises, and async/await',
            duration: 80,
          },
        ],
      },
      {
        title: 'Web Design with Tailwind CSS',
        description: 'Create beautiful and responsive websites using Tailwind CSS. Learn utility-first CSS and design principles.',
        category: 'Design',
        level: 'Beginner',
        duration: 15,
        price: 29.99,
        thumbnail: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Tailwind CSS Basics',
            description: 'Getting started with Tailwind',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Building Components',
            description: 'Create reusable components',
            duration: 60,
          },
        ],
      },
      {
        title: 'Node.js & Express Backend Development',
        description: 'Build scalable backend applications with Node.js and Express. Learn REST APIs, middleware, and database integration.',
        category: 'Development',
        level: 'Intermediate',
        duration: 40,
        price: 69.99,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Express Basics',
            description: 'Setting up Express server',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'REST APIs',
            description: 'Building REST APIs',
            duration: 70,
          },
        ],
      },
      {
        title: 'MongoDB Database Design',
        description: 'Master MongoDB with comprehensive coverage of schemas, indexing, aggregation, and optimization techniques.',
        category: 'Development',
        level: 'Advanced',
        duration: 30,
        price: 79.99,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'MongoDB Basics',
            description: 'Introduction to MongoDB',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Aggregation Framework',
            description: 'Advanced queries',
            duration: 75,
          },
        ],
      },
      {
        title: 'Business Strategy & Marketing',
        description: 'Learn essential business strategies and marketing techniques to grow your business. Expert insights from industry leaders.',
        category: 'Business',
        level: 'Beginner',
        duration: 25,
        price: 39.99,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Business Basics',
            description: 'Fundamentals of business',
            duration: 50,
          },
        ],
      },
    ];

    const courses = await Course.insertMany(sampleCourses);

    res.status(201).json({
      success: true,
      message: 'Sample courses seeded successfully',
      count: courses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Protected routes
router.post('/', protect, isInstructor, createCourse);
router.put('/:id', protect, isInstructor, updateCourse);
router.delete('/:id', protect, isInstructor, deleteCourse);
router.get('/instructor/my-courses', protect, isInstructor, getInstructorCourses);

// Video routes
router.post('/:id/videos', protect, isInstructor, addVideo);
router.post('/:courseId/videos/:videoId/comments', protect, addVideoComment);
router.delete('/:courseId/videos/:videoId', protect, isInstructor, deleteVideo);

// Resource routes
router.post('/:id/resources', protect, isInstructor, addResource);
router.delete('/:courseId/resources/:resourceId', protect, isInstructor, deleteResource);

// Lesson routes for mixed ordered content
router.post('/:id/lessons', protect, isInstructor, addLesson);
router.put('/:id/lessons/:lessonId', protect, isInstructor, updateLesson);
router.delete('/:courseId/lessons/:lessonId', protect, isInstructor, deleteLesson);

// Publish route
router.put('/:id/publish', protect, isInstructor, publishCourse);

module.exports = router;
