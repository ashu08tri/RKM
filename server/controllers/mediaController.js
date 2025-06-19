const asyncHandler = require('express-async-handler');
const Media = require('../models/Media');
const { cloudinary } = require('../config/cloudinaryConfig'); // Import Cloudinary instance

// @desc    Get all media items
// @route   GET /api/media
// @access  Public (or Private/Admin if only admins can see all raw media data)
const getMediaItems = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) {
    // Support multiple categories via comma-separated string
    const categories = req.query.category.split(',').map(cat => cat.trim());
    query.category = { $in: categories };
  }
  if (req.query.tabAssociation) {
    query.tabAssociation = req.query.tabAssociation;
  }
  const mediaItems = await Media.find(query).populate('uploadedBy', 'name email').sort({ uploadDate: -1 });
  res.json(mediaItems);
});

// @desc    Get single media item by ID
// @route   GET /api/media/:id
// @access  Public
const getMediaItemById = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id).populate('uploadedBy', 'name email');
  if (mediaItem) {
    res.json(mediaItem);
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

// @desc    Create a new media item
// @route   POST /api/media
// @access  Private/Admin
const createMediaItem = asyncHandler(async (req, res) => {
  try {
    // Extract data from request
    const { title, description, type, category, tabAssociation, gallery } = req.body;
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Validate required fields
    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    // If no main file is uploaded
    if (!req.files || !req.files.mediafile) {
      res.status(400);
      throw new Error('No file uploaded. Please include a media file.');
    }

    const mainFile = req.files.mediafile[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    // Map media type to fileType enumeration
    let fileType = 'image'; // Default
    if (type === 'News Article') fileType = 'document';
    if (type === 'Documentary' || type === 'Video Series') fileType = 'video';

    // Default category if not provided
    const defaultCategory = 'MediaTab';

    // Handle gallery images from request body
    if (gallery) {
      try {
        // If gallery is a JSON string, parse it
        let parsedGallery = [];
        
        if (typeof gallery === 'string') {
          // Skip processing if it's the invalid "[object Object]" string
          if (gallery === "[object Object]") {
            console.log('Skipping invalid gallery data: [object Object]');
            parsedGallery = [];
          } else {
            try {
              parsedGallery = JSON.parse(gallery);
              console.log('Parsed gallery from string:', parsedGallery);
            } catch (err) {
              console.error('Error parsing gallery JSON string:', err);
              // Try to handle comma-separated URLs
              if (gallery.includes(',') || gallery.includes('http')) {
                parsedGallery = gallery.split(',')
                  .map(url => url.trim())
                  .filter(url => url.length > 0)
                  .map(url => ({
                    url: url,
                    publicId: url.split('/').pop().split('.')[0]
                  }));
                console.log('Parsed gallery from comma-separated URLs:', parsedGallery);
              }
            }
          }
        } else if (gallery === null || gallery === undefined) {
          parsedGallery = [];
        } else if (Array.isArray(gallery)) {
          parsedGallery = gallery;
        } else if (typeof gallery === 'object') {
          // Handle the case when gallery is already an object but not an array
          console.log('Gallery is an object but not an array, converting to array:', gallery);
          parsedGallery = [gallery]; // Wrap in array
        }
        
        mediaItem.gallery = parsedGallery;
      } catch (err) {
        console.error('Error parsing gallery:', err);
      }
    }

    // Create new media item
    const mediaItem = new Media({
      title,
      description: description || '',
      fileName: mainFile.filename || mainFile.originalname, // Store Cloudinary public_id or original filename
      filePath: mainFile.path || '', // Store Cloudinary URL
      fileType: fileType,
      category: category || defaultCategory,
      tabAssociation: tabAssociation || '',
      uploadedBy: req.user._id,
      viewCount: 0,
    });

    // Handle thumbnail if provided
    if (thumbnailFile) {
      mediaItem.thumbnailFileName = thumbnailFile.filename || thumbnailFile.originalname;
      mediaItem.thumbnailPath = thumbnailFile.path || '';
    }
    
    // Auto-extract duration for video files
    if (fileType === 'video' && mainFile && mainFile.path) {
      try {
        // Extract the public ID from the Cloudinary URL or filename
        const publicId = mainFile.filename || mainFile.path.split('/').pop().split('.')[0];
        
        // Get video metadata from Cloudinary
        const result = await cloudinary.api.resource(publicId, { 
          resource_type: 'video',
          image_metadata: true
        });
        
        if (result && result.duration) {
          // Format duration as MM:SS
          const minutes = Math.floor(result.duration / 60);
          const seconds = Math.floor(result.duration % 60);
          mediaItem.duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          console.log(`Video duration automatically set to: ${mediaItem.duration}`);
        }
      } catch (err) {
        console.error('Error extracting video duration:', err);
        // Don't fail the upload if duration extraction fails
      }
    }

    const createdMediaItem = await mediaItem.save();
    res.status(201).json(createdMediaItem);
  } catch (error) {
    console.error('Error creating media item:', error);
    res.status(500).json({
      message: error.message,
      details: error.stack
    });
  }
});

// @desc    Update a media item
// @route   PUT /api/media/:id
// @access  Private/Admin
const updateMediaItem = asyncHandler(async (req, res) => {
  try {
    const { title, description, type, fileType, category, tabAssociation, gallery } = req.body;
    console.log('Update request body:', req.body);
    console.log('Update request files:', req.files);

    const mediaItem = await Media.findById(req.params.id);

    if (!mediaItem) {
      res.status(404);
      throw new Error('Media item not found');
    }

    // Check if a new main file is uploaded
    if (req.files && req.files.mediafile) {
      const mainFile = req.files.mediafile[0];
      console.log('New main file uploaded, updating file information');
      
      // If there's an old file associated with this media item, delete it from Cloudinary
      if (mediaItem.fileName) { // fileName stores the public_id
        try {
          const resourceType = mediaItem.fileType === 'video' ? 'video' : 'image';
          await cloudinary.uploader.destroy(mediaItem.fileName, { resource_type: resourceType });
        } catch (err) {
          console.error('Cloudinary: Error deleting old file during update:', err);
          // We'll continue even if deletion fails
        }
      }
      
      // Update with new file's details from Cloudinary
      mediaItem.fileName = mainFile.filename; // New public_id
      mediaItem.filePath = mainFile.path;   // New Cloudinary URL
      
      // Determine if this is a video file and update type if so
      let newFileType = mediaItem.fileType;
      if (type) {
        if (type === 'News Article') newFileType = 'document';
        else if (type === 'Documentary' || type === 'Video Series') newFileType = 'video';
        else newFileType = 'image';
      }
      
      // Auto-extract duration for video files
      if (newFileType === 'video') {
        try {
          // Extract the public ID from the Cloudinary URL or filename
          const publicId = mainFile.filename || mainFile.path.split('/').pop().split('.')[0];
          
          // Get video metadata from Cloudinary
          const result = await cloudinary.api.resource(publicId, { 
            resource_type: 'video',
            image_metadata: true
          });
          
          if (result && result.duration) {
            // Format duration as MM:SS
            const minutes = Math.floor(result.duration / 60);
            const seconds = Math.floor(result.duration % 60);
            mediaItem.duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            console.log(`Video duration automatically set to: ${mediaItem.duration}`);
          }
        } catch (err) {
          console.error('Error extracting video duration:', err);
          // Don't fail the update if duration extraction fails
        }
      }
    } else {
      console.log('No new main file uploaded, keeping existing file');
    }

    // Check if a new thumbnail is uploaded
    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail[0];
      console.log('New thumbnail uploaded, updating thumbnail information');
      
      // If there's an old thumbnail associated with this media item, delete it from Cloudinary
      if (mediaItem.thumbnailFileName) {
        try {
          await cloudinary.uploader.destroy(mediaItem.thumbnailFileName, { resource_type: 'image' });
        } catch (err) {
          console.error('Cloudinary: Error deleting old thumbnail during update:', err);
          // We'll continue even if deletion fails
        }
      }
      
      // Update with new thumbnail details from Cloudinary
      mediaItem.thumbnailFileName = thumbnailFile.filename;
      mediaItem.thumbnailPath = thumbnailFile.path;
    }

    // Map media type to fileType if provided
    if (type) {
      if (type === 'News Article') {
        mediaItem.fileType = 'document';
      } else if (type === 'Documentary' || type === 'Video Series') {
        mediaItem.fileType = 'video';
      } else {
        mediaItem.fileType = 'image'; // Default
      }
    } else if (fileType) {
      // If fileType is provided directly, use it
      mediaItem.fileType = fileType;
    }

    // Handle gallery images from request body
    if (gallery) {
      try {
        // If gallery is a JSON string, parse it
        let parsedGallery = [];
        
        if (typeof gallery === 'string') {
          // Skip processing if it's the invalid "[object Object]" string
          if (gallery === "[object Object]") {
            console.log('Skipping invalid gallery data: [object Object]');
            parsedGallery = [];
          } else {
            try {
              parsedGallery = JSON.parse(gallery);
              console.log('Parsed gallery from string:', parsedGallery);
            } catch (err) {
              console.error('Error parsing gallery JSON string:', err);
              // Try to handle comma-separated URLs
              if (gallery.includes(',') || gallery.includes('http')) {
                parsedGallery = gallery.split(',')
                  .map(url => url.trim())
                  .filter(url => url.length > 0)
                  .map(url => ({
                    url: url,
                    publicId: url.split('/').pop().split('.')[0]
                  }));
                console.log('Parsed gallery from comma-separated URLs:', parsedGallery);
              }
            }
          }
        } else if (gallery === null || gallery === undefined) {
          parsedGallery = [];
        } else if (Array.isArray(gallery)) {
          parsedGallery = gallery;
        } else if (typeof gallery === 'object') {
          // Handle the case when gallery is already an object but not an array
          console.log('Gallery is an object but not an array, converting to array:', gallery);
          parsedGallery = [gallery]; // Wrap in array
        }
        
        mediaItem.gallery = parsedGallery;
      } catch (err) {
        console.error('Error parsing gallery:', err);
      }
    }

    // Update other fields if provided
    if (title !== undefined) mediaItem.title = title;
    if (description !== undefined) mediaItem.description = description;
    if (category !== undefined) mediaItem.category = category;
    if (tabAssociation !== undefined) mediaItem.tabAssociation = tabAssociation;
    
    mediaItem.uploadedBy = req.user._id; // Update who last modified it

    const updatedMediaItem = await mediaItem.save();
    res.json(updatedMediaItem);
  } catch (error) {
    console.error('Error updating media item:', error);
    res.status(500).json({
      message: error.message,
      details: error.stack
    });
  }
});

// @desc    Delete a media item
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMediaItem = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (mediaItem) {
    // Delete the main file from Cloudinary using its public_id (stored in fileName)
    if (mediaItem.fileName) {
      try {
        const resourceType = mediaItem.fileType === 'video' ? 'video' : 'image';
        const result = await cloudinary.uploader.destroy(mediaItem.fileName, { resource_type: resourceType });
        if (result.result !== 'ok' && result.result !== 'not found') {
            console.error('Cloudinary: Error deleting main file:', result);
            // Decide if you want to throw an error or just log it and proceed with DB deletion
        }
      } catch (err) {
        console.error('Cloudinary: Exception during main file deletion:', err);
        // Decide if you want to throw an error or just log it and proceed with DB deletion
      }
    }
    
    // Delete the thumbnail file if it exists
    if (mediaItem.thumbnailFileName) {
      try {
        const result = await cloudinary.uploader.destroy(mediaItem.thumbnailFileName, { resource_type: 'image' });
        if (result.result !== 'ok' && result.result !== 'not found') {
            console.error('Cloudinary: Error deleting thumbnail file:', result);
        }
      } catch (err) {
        console.error('Cloudinary: Exception during thumbnail deletion:', err);
      }
    }
    
    await mediaItem.deleteOne(); 
    res.json({ message: 'Media item removed' });
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

// @desc    Increment the view count for a media item
// @route   PUT /api/media/:id/view
// @access  Public
const incrementViewCount = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (mediaItem) {
    mediaItem.viewCount = (mediaItem.viewCount || 0) + 1;
    await mediaItem.save();
    res.json({ viewCount: mediaItem.viewCount });
  } else {
    res.status(404);
    throw new Error('Media item not found');
  }
});

module.exports = {
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  incrementViewCount,
};
