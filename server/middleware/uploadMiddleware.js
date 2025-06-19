const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig'); // Import Cloudinary storage configuration

// Init upload with Cloudinary storage
const upload = multer({
  storage: storage, // Use CloudinaryStorage instance
  limits: { fileSize: 25000000 }, // 25MB limit, adjust as needed. Cloudinary free tier has limits.
  // fileFilter can be added here if more specific validation is needed beyond Cloudinary's allowed_formats
});

// Middleware for single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple files upload
const uploadMultiple = (fieldNames) => {
  const fields = fieldNames.map(name => ({
    name,
    maxCount: name === 'gallery' ? 10 : 1 // Allow up to 10 images for gallery, 1 for other fields
  }));
  return upload.fields(fields);
};

// Middleware for multiple fields with different names (used for main file + thumbnail)
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields
};


