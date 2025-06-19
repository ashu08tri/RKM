const express = require('express');
const router = express.Router();
const {
  getInformationItems,
  createInformationItem,
  updateInformationItem,
  deleteInformationItem,
} = require('../controllers/informationController');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getInformationItems)
  .post(protect, admin, uploadSingle('image'), createInformationItem);

router
  .route('/:id')
  .put(protect, admin, uploadSingle('image'), updateInformationItem)
  .delete(protect, admin, deleteInformationItem);

module.exports = router;
