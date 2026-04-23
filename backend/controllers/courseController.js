// Course controller
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = { isPublished: true }; // Restore published filter

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create course (instructor/admin only)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      thumbnail,
      price,
      paymentType,
      paymentMethods,
      currency,
      discount,
      discountExpiry,
      refundPolicy,
      certificateAvailable,
      certificatePrice,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    const courseData = {
      title,
      description,
      category,
      level,
      thumbnail,
      price: price || 0,
      instructor: req.user._id,
      instructorName: req.user.name,
      paymentType: paymentType || 'free',
      paymentMethods: paymentMethods || [],
      currency: currency || 'USD',
      discount: discount || 0,
      discountedPrice: price ? price - (price * (discount || 0)) / 100 : 0,
      discountExpiry: discountExpiry || null,
      refundPolicy: refundPolicy || '14_days',
      certificateAvailable: certificateAvailable !== undefined ? certificateAvailable : true,
      certificatePrice: certificatePrice || 0,
      isPaymentRequired: paymentType === 'paid' || paymentType === 'premium',
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(ytRegex);
  return match ? match[1] : null;
};

const getYoutubeThumbnailUrl = (url) => {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/0.jpg` : '';
};

// Update course (instructor owner only)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    if (Array.isArray(req.body.lessons)) {
      req.body.lessons = req.body.lessons.map((lesson) => {
        const sanitized = {
          type: lesson.type || 'video',
          title: lesson.title || '',
          url: lesson.url || '',
          description: lesson.description || '',
          duration: Number(lesson.duration) || 0,
          thumbnail: lesson.thumbnail || (lesson.type === 'video' ? getYoutubeThumbnailUrl(lesson.url) : ''),
        };

        if (lesson._id && mongoose.Types.ObjectId.isValid(lesson._id)) {
          sanitized._id = lesson._id;
        }
        return sanitized;
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add course resource (pdf/doc/video reference)
exports.addResource = async (req, res) => {
  try {
    const { title, type, url, description } = req.body;
    const courseId = req.params.id;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Provide title and URL for resource',
      });
    }

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
        message: 'Not authorized to add resources',
      });
    }

    const resource = {
      _id: new mongoose.Types.ObjectId(),
      title,
      type: type || 'other',
      url,
      description,
    };

    course.resources = course.resources || [];
    course.resources.push(resource);
    await course.save();

    res.status(201).json({
      success: true,
      resource,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete resource
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get instructor courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add video to course
exports.addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, duration } = req.body;
    const courseId = req.params.id;

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
        message: 'Not authorized to add videos',
      });
    }

    const video = {
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      videoUrl,
      duration,
    };

    course.videos.push(video);
    await course.save();

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add comment to a video inside a course
exports.addVideoComment = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const video = course.videos.id(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to comment on the video',
      });
    }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      userName: req.user.name,
      text,
    };

    video.comments = video.comments || [];
    video.comments.push(comment);
    await course.save();

    res.status(201).json({
      success: true,
      comment,
      videoComments: video.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete video from course
exports.deleteVideo = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

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
        message: 'Not authorized',
      });
    }

    course.videos = course.videos.filter((v) => v._id.toString() !== videoId);
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;

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
        message: 'Not authorized',
      });
    }

    course.resources = course.resources.filter((r) => r._id.toString() !== resourceId);
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add lesson to course (ordered mix of video/pdf/document/other)
exports.addLesson = async (req, res) => {
  try {
    const { type, title, url, description, duration } = req.body;
    const courseId = req.params.id;

    if (!type || !title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and URL for lesson',
      });
    }

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
        message: 'Not authorized to add lessons',
      });
    }

    const lesson = {
      _id: new mongoose.Types.ObjectId(),
      type,
      title,
      url,
      description,
      duration: duration || 0,
    };

    course.lessons = course.lessons || [];
    course.lessons.push(lesson);
    await course.save();

    res.status(201).json({
      success: true,
      lesson,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { type, title, url, description, duration } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit lessons' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (type) lesson.type = type;
    if (title) lesson.title = title;
    if (url) lesson.url = url;
    if (description !== undefined) lesson.description = description;
    if (duration !== undefined) lesson.duration = duration;

    await course.save();

    res.status(200).json({ success: true, lesson, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete lessons' });
    }

    course.lessons = course.lessons.filter((l) => l._id.toString() !== lessonId);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Publish course
exports.publishCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    course.isPublished = true;
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
