const express = require('express');
const router = express.Router();
const {
  getUsersByInstitution,
  getAllUsers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllUsers);
router.get('/institution/:institution', getUsersByInstitution);

module.exports = router;
