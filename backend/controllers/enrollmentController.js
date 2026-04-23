// Enrollment controller
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Enroll student in course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (enrollment) {
      return res.status(409).json({
        success: false,
        message: 'Already enrolled in this course',
      });
    }

    // Create enrollment
    enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: 'enrolled',
    });

    // Add student to course
    course.students.push(req.user._id);
    course.totalStudents = course.students.length;
    await course.save();

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get student enrollments
exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course')
      .sort('-enrollmentDate');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get enrollment details
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, videoId, watchedDuration } = req.body;

    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = Math.min(progress, 100);
      if (progress >= 100) {
        enrollment.status = 'completed';
      } else if (progress > 0) {
        enrollment.status = 'in-progress';
      }
    }

    // Track video watch
    if (videoId) {
      const videoWatched = enrollment.videosWatched.find(
        (v) => v.videoId.toString() === videoId
      );

      if (videoWatched) {
        videoWatched.duration = watchedDuration || videoWatched.duration;
      } else {
        enrollment.videosWatched.push({
          videoId,
          duration: watchedDuration || 0,
        });
      }

      // Mark as completed if fully watched
      if (
        watchedDuration &&
        !enrollment.completedVideos.includes(videoId)
      ) {
        enrollment.completedVideos.push(videoId);
      }
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get course enrollments (instructor only)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is instructor of this course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view enrollments',
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email avatar')
      .sort('-enrollmentDate');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Issue certificate
exports.issueCertificate = async (req, res) => {
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

    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course must be 100% complete to issue certificate',
      });
    }

    enrollment.certificateIssued = true;
    enrollment.certificateIssuedDate = new Date();
    await enrollment.save();

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
