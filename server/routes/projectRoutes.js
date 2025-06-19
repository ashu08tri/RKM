const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getProjects);
router.route('/:id').get(getProjectById);

// Admin routes
router.route('/')
  .post(protect, admin, uploadMultiple(['coverImage', 'gallery']), createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(protect, admin, uploadMultiple(['coverImage', 'gallery']), updateProject)
  .delete(protect, admin, deleteProject);

module.exports = router;
