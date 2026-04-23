// Authentication controller
const User = require('../models/User');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      dbHost: user.dbHost || (require('mongoose').connection.host),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Register request body:', req.body);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      dbHost: require('mongoose').connection.host,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Login request body:', req.body);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    let user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Debug endpoint to verify DB user entries
exports.debugUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      dbHost: require('mongoose').connection.host,
      totalUsers,
      users,
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
