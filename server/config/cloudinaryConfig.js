const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Ensure environment variables are loaded

// Set default values for Cloudinary credentials if they're not in the environment
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
const apiKey = process.env.CLOUDINARY_API_KEY || '123456789012345';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'dummy_secret';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Create a test folder if credentials are the defaults
const useTestFolder = cloudName === 'demo';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      // Determine resource type from the request path for folder organization
      const urlPath = req.originalUrl ? req.originalUrl.toLowerCase() : '/media';
      let resourceType = 'misc'; // Default folder
      if (urlPath.includes('/media')) resourceType = 'media';
      else if (urlPath.includes('/programs')) resourceType = 'programs';
      else if (urlPath.includes('/projects')) resourceType = 'projects';
      else if (urlPath.includes('/team')) resourceType = 'team';
      else if (urlPath.includes('/members')) resourceType = 'members';

      // Sanitize a category from the request body for the filename
      let category = 'general';
      if (req.body) {
        category = (req.body.category || req.body.type || 'general')
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
      
      // Create a timestamp for the filename
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const timestamp = `${year}_${month}`;

      // Generate a unique public_id (filename)
      const public_id = `${resourceType}_${category}_${timestamp}_${Date.now()}`;

      // Set the folder path - use test folder for demo credentials
      const folder = useTestFolder 
        ? 'test_uploads' 
        : `rashtriya_kishan_manch/${resourceType}`;

      console.log('Cloudinary upload parameters:', {
        folder,
        public_id,
        resource_type: 'auto'
      });

      return {
        folder: folder,
        public_id: public_id,
        resource_type: 'auto', // Let Cloudinary auto-detect the resource type
      };
    } catch (error) {
      console.error('Error configuring Cloudinary storage:', error);
      // Return default values in case of error
      return {
        folder: useTestFolder ? 'test_uploads' : 'rashtriya_kishan_manch/uploads',
        public_id: `upload_${Date.now()}`,
        resource_type: 'auto',
      };
    }
  },
});

module.exports = { cloudinary, storage };
