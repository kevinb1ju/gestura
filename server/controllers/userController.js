const User = require('../models/User');

// Get users by institution and role
exports.getUsersByInstitution = async (req, res) => {
  try {
    const { institution } = req.params;
    const { role } = req.query;

    const query = { institution };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users (with optional filters)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, institution } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (institution) query.institution = institution;

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
