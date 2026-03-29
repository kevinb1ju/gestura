const Institution = require('../models/Institution');
const User = require('../models/User');

// Get all institutions
exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find().sort({ createdAt: -1 });
    
    // Get teacher and student counts for each institution
    const institutionsWithCounts = await Promise.all(
      institutions.map(async (inst) => {
        const teachers = await User.countDocuments({ 
          institution: inst.name, 
          role: 'teacher' 
        });
        const students = await User.countDocuments({ 
          institution: inst.name, 
          role: 'student' 
        });
        
        return {
          _id: inst._id,
          name: inst.name,
          status: inst.status,
          teachers,
          students,
          createdAt: inst.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: institutions.length,
      institutions: institutionsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create institution
exports.createInstitution = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Institution.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Institution already exists',
      });
    }

    const institution = await Institution.create({ name });

    res.status(201).json({
      success: true,
      institution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update institution
exports.updateInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    res.status(200).json({
      success: true,
      institution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete institution
exports.deleteInstitution = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    const institutionName = institution.name;

    // Delete all users associated with this institution
    await User.deleteMany({ institution: institutionName });

    await institution.deleteOne();

    res.status(200).json({
      success: true,
      message: `Institution "${institutionName}" and all associated users deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
