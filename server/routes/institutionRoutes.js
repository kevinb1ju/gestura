const express = require('express');
const router = express.Router();
const {
  getAllInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} = require('../controllers/institutionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllInstitutions)
  .post(protect, authorize('admin'), createInstitution);

router.route('/:id')
  .put(protect, authorize('admin'), updateInstitution)
  .delete(protect, authorize('admin'), deleteInstitution);

module.exports = router;
