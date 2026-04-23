const mongoose = require('./backend/node_modules/mongoose');

async function checkCourses() {
    try {
        await mongoose.connect('mongodb+srv://govind:govind@cluster0.aw2pzjh.mongodb.net/lms?appName=Cluster0');
        console.log('Connected to MongoDB');

        const Course = mongoose.model('Course', new mongoose.Schema({
            title: String,
            description: String,
            category: String,
            level: String,
            duration: Number,
            price: Number,
            thumbnail: String,
            instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            instructorName: String,
            isPublished: Boolean,
            videos: Array,
        }));

        const courses = await Course.find({}).limit(10);
        console.log('Courses found:', courses.length);
        courses.forEach(course => {
            console.log('ID:', course._id, 'Title:', course.title);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCourses();