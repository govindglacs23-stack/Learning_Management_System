// Main server file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB().then(async () => {
  // Seed sample data if database is empty
  const Course = require('./models/Course');
  const User = require('./models/User');
  const mongoose = require('mongoose');

  try {
    const courseCount = await Course.countDocuments();

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

    // Only seed if the database is empty (never delete existing data)
    if (courseCount > 0) {
      console.log(`Database already has ${courseCount} courses. Skipping seed.`);
      return;
    }

    const sampleCourses = [
      {
        title: 'React.js Fundamentals',
        description: 'Learn the basics of React.js including components, props, state, and hooks. Perfect for beginners who want to start web development with React.',
        category: 'Programming',
        level: 'Beginner',
        duration: 20,
        price: 49.99,
        paymentType: 'paid',
        paymentMethods: ['credit_card', 'paypal', 'stripe'],
        currency: 'USD',
        discount: 20,
        discountedPrice: 39.99,
        refundPolicy: '14_days',
        certificateAvailable: true,
        certificatePrice: 9.99,
        isPaymentRequired: true,
        thumbnail: 'https://images.unsplash.com/photo-1633356713697-d3e7e9e17a9e?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Introduction to React',
            description: 'Get started with React basics and understand the core concepts',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Components and Props',
            description: 'Learn how to create and manage React components',
            videoUrl: 'https://www.youtube.com/watch?v=9no-Bub2ybA',
            duration: 60,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'State and Hooks',
            description: 'Master React hooks and state management',
            videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
            duration: 75,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'React Cheat Sheet',
            type: 'pdf',
            url: 'https://www.example.com/react-cheatsheet.pdf',
            description: 'Quick reference guide for React syntax and methods',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Starter Code Repository',
            type: 'document',
            url: 'https://github.com',
            description: 'GitHub repository with all starter code and examples',
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
        paymentType: 'paid',
        paymentMethods: ['credit_card', 'paypal'],
        currency: 'USD',
        discount: 15,
        discountedPrice: 50.99,
        refundPolicy: '30_days',
        certificateAvailable: true,
        certificatePrice: 14.99,
        isPaymentRequired: true,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'ES6 Basics',
            description: 'Learn modern JavaScript features with ES6',
            videoUrl: 'https://www.youtube.com/watch?v=IqMGRkwWULo',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Async Programming',
            description: 'Master promises, async/await, and callbacks',
            videoUrl: 'https://www.youtube.com/watch?v=ZYb_ZU8LNv4',
            duration: 65,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'JavaScript Style Guide',
            type: 'pdf',
            url: 'https://www.example.com/js-styleguide.pdf',
            description: 'Best practices and coding standards for JavaScript',
          },
        ],
      },
      {
        title: 'Node.js & Express Backend Development',
        description: 'Build scalable backend applications using Node.js and Express. Learn REST APIs, middleware, authentication, and database integration.',
        category: 'Development',
        level: 'Intermediate',
        duration: 40,
        price: 69.99,
        paymentType: 'premium',
        paymentMethods: ['credit_card', 'stripe', 'bank_transfer'],
        currency: 'USD',
        discount: 25,
        discountedPrice: 52.49,
        refundPolicy: '14_days',
        certificateAvailable: true,
        certificatePrice: 19.99,
        isPaymentRequired: true,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Setting up Node.js & Express',
            description: 'Get started with Node.js and create your first Express server',
            videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'RESTful API Design',
            description: 'Learn how to design and build RESTful APIs',
            videoUrl: 'https://www.youtube.com/watch?v=pY0LnG7owNY',
            duration: 60,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Authentication & Authorization',
            description: 'Implement JWT authentication and user roles',
            videoUrl: 'https://www.youtube.com/watch?v=7aIVeAV5MCU',
            duration: 70,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Database Integration',
            description: 'Connect your application to MongoDB and PostgreSQL',
            videoUrl: 'https://www.youtube.com/watch?v=2Z1VqKvYqwc',
            duration: 55,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Express.js Documentation',
            type: 'document',
            url: 'https://expressjs.com',
            description: 'Official Express.js documentation and guides',
          },
        ],
      },
      {
        title: 'Web Design with Tailwind CSS',
        description: 'Create beautiful and responsive websites using Tailwind CSS. Learn utility-first CSS design principles and modern web design practices.',
        category: 'Design',
        level: 'Beginner',
        duration: 25,
        price: 39.99,
        paymentType: 'paid',
        paymentMethods: ['credit_card', 'paypal'],
        currency: 'USD',
        discount: 10,
        discountedPrice: 35.99,
        refundPolicy: '7_days',
        certificateAvailable: true,
        certificatePrice: 7.99,
        isPaymentRequired: true,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Tailwind CSS Basics',
            description: 'Introduction to utility-first CSS with Tailwind',
            videoUrl: 'https://youtu.be/gWOi2v5PAes?si=oF_k1iEJzBF4f5wN',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Responsive Design',
            description: 'Build mobile-first responsive layouts with Tailwind',
            videoUrl: 'https://www.youtube.com/watch?v=dWBwLIIkpXc',
            duration: 60,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Advanced Components',
            description: 'Create complex UI components with Tailwind CSS',
            videoUrl: 'https://www.youtube.com/watch?v=a1RbdQ76-cQ',
            duration: 45,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Tailwind CSS Cheat Sheet',
            type: 'pdf',
            url: 'https://www.example.com/tailwind-cheatsheet.pdf',
            description: 'Complete reference of Tailwind CSS utilities',
          },
        ],
      },
      {
        title: 'Python for Beginners',
        description: 'Learn Python programming from scratch. Perfect for beginners who want to get into programming. Cover basics, functions, OOP, and more.',
        category: 'Programming',
        level: 'Beginner',
        duration: 30,
        price: 44.99,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b07e?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Python Setup & Basics',
            description: 'Install Python and learn basic syntax',
            videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtik',
            duration: 40,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Data Types & Variables',
            description: 'Understand Python data types and variables',
            videoUrl: 'https://www.youtube.com/watch?v=OYOrjQMhzEA',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Functions & Loops',
            description: 'Master functions, loops, and control flow',
            videoUrl: 'https://www.youtube.com/watch?v=XKHEtdqSLV8',
            duration: 65,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Object-Oriented Programming',
            description: 'Learn OOP concepts in Python',
            videoUrl: 'https://www.youtube.com/watch?v=Ej_02ICONl0',
            duration: 70,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Python Official Docs',
            type: 'document',
            url: 'https://docs.python.org',
            description: 'Official Python documentation',
          },
        ],
      },
      {
        title: 'MongoDB Database Design',
        description: 'Master MongoDB and NoSQL database design. Learn document modeling, indexing, aggregation, and best practices for modern applications.',
        category: 'Programming',
        level: 'Advanced',
        duration: 35,
        price: 79.99,
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'MongoDB Fundamentals',
            description: 'Introduction to MongoDB and document databases',
            videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
            duration: 55,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Document Design Patterns',
            description: 'Best practices for designing MongoDB documents',
            videoUrl: 'https://www.youtube.com/watch?v=leNCvU8paco',
            duration: 65,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Aggregation Framework',
            description: 'Advanced queries with MongoDB aggregation framework',
            videoUrl: 'https://www.youtube.com/watch?v=xNVlDEzz7zk',
            duration: 75,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Indexing & Performance',
            description: 'Optimize queries with proper indexing strategies',
            videoUrl: 'https://www.youtube.com/watch?v=7CqFsHWTZqE',
            duration: 60,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'MongoDB Manual',
            type: 'document',
            url: 'https://docs.mongodb.com/manual',
            description: 'Official MongoDB documentation and guides',
          },
        ],
      },
      {
        title: 'Business Strategy & Marketing',
        description: 'Learn digital marketing strategies and business development. Cover SEO, social media, content marketing, and analytics for business growth.',
        category: 'Business',
        level: 'Intermediate',
        duration: 28,
        price: 54.99,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        instructor: instructor._id,
        instructorName: instructor.name,
        isPublished: true,
        videos: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Digital Marketing Basics',
            description: 'Introduction to digital marketing strategies',
            videoUrl: 'https://www.youtube.com/watch?v=x4-9sRfmN-4',
            duration: 45,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'SEO Essentials',
            description: 'Master search engine optimization techniques',
            videoUrl: 'https://www.youtube.com/watch?v=SnxeXZpZkI0',
            duration: 55,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Social Media Strategy',
            description: 'Create effective social media marketing campaigns',
            videoUrl: 'https://www.youtube.com/watch?v=1ZE_oL1LoHc',
            duration: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Analytics & Metrics',
            description: 'Track and measure marketing performance',
            videoUrl: 'https://www.youtube.com/watch?v=6xwTmzuHnIE',
            duration: 40,
          },
        ],
        resources: [
          {
            _id: new mongoose.Types.ObjectId(),
            title: 'Marketing Templates',
            type: 'document',
            url: 'https://www.example.com/templates',
            description: 'Ready-to-use marketing templates and checklists',
          },
        ],
      },
    ];

    console.log('Seeding sample courses with video URLs...');
    await Course.insertMany(sampleCourses);
    console.log('Sample courses seeded successfully with ' + sampleCourses.length + ' courses');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
});

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://learning-management-system-3-cy7c.onrender.com',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

// Export app for Vercel serverless (module.exports needed if deploying to Vercel)
module.exports = app;

// Start server on Render, local dev, or any non-Vercel environment
// Vercel automatically sets process.env.VERCEL = "1"
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
