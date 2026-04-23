const mongoose = require('./backend/node_modules/mongoose');

async function createSampleInstructorCourse() {
    try {
        await mongoose.connect('mongodb+srv://govind:govind@cluster0.aw2pzjh.mongodb.net/lms?appName=Cluster0');
        console.log('Connected to MongoDB');

        const Course = require('./backend/models/Course');
        const User = require('./backend/models/User');

        // Get or create an instructor
        let instructor = await User.findOne({ email: 'instructor@example.com' });
        if (!instructor) {
            console.log('Creating instructor...');
            instructor = await User.create({
                name: 'Jane Instructor',
                email: 'instructor@example.com',
                password: 'password123',
                role: 'instructor',
            });
        }
        console.log('Instructor:', instructor.name, instructor._id);

        // Create a sample course with videos
        const newCourse = await Course.create({
            title: 'My Web Development Course',
            description: 'Learn modern web development with React, Node.js, and MongoDB. This course covers all the essentials for building full-stack web applications.',
            category: 'Development',
            level: 'Intermediate',
            duration: 24,
            price: 39.99,
            thumbnail: 'https://images.unsplash.com/photo-1633356713697-d3e7e9e17a9e?w=400&h=250&fit=crop',
            instructor: instructor._id,
            instructorName: instructor.name,
            isPublished: true,
            videos: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Course Introduction',
                    description: 'Welcome! An overview of what you will learn in this course.',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    duration: 10,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Setup Your Development Environment',
                    description: 'Install Node.js, npm, and VS Code. Setup your first React project.',
                    videoUrl: 'https://www.youtube.com/watch?v=9no-Bub2ybA',
                    duration: 25,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'React Basics - Components & JSX',
                    description: 'Learn about React components, JSX syntax, and functional components.',
                    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
                    duration: 45,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'State Management with Hooks',
                    description: 'Master useState, useEffect, and custom hooks for managing component state.',
                    videoUrl: 'https://www.youtube.com/watch?v=IqMGRkwWULo',
                    duration: 50,
                },
            ],
            resources: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Course Code Repository',
                    type: 'document',
                    url: 'https://github.com',
                    description: 'GitHub repository with all code examples from the course',
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'React Cheat Sheet',
                    type: 'pdf',
                    url: 'https://www.example.com/react-cheatsheet.pdf',
                    description: 'Quick reference guide for React hooks and methods',
                },
            ],
        });

        console.log('\n✅ Sample course created successfully!');
        console.log('Course ID:', newCourse._id);
        console.log('Course Title:', newCourse.title);
        console.log('Published:', newCourse.isPublished);
        console.log('Videos:', newCourse.videos.length);
        console.log('\nYou can now view this course at: http://localhost:3000/courses');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createSampleInstructorCourse();
