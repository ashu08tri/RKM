const Timeline = require('../models/Timeline');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinaryConfig');

// @desc    Get all timeline entries
// @route   GET /api/timeline
// @access  Public
const getTimelines = asyncHandler(async (req, res) => {
  try {
    const query = {};

    // Filter by isKeyMilestone if requested
    if (req.query.isKeyMilestone) {
      query.isKeyMilestone = req.query.isKeyMilestone === 'true';
    }

    // Sort by date in descending order (newest first)
    const timelines = await Timeline.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: timelines.length,
      data: timelines
    });
  } catch (error) {
    console.error('Error in getTimelines controller:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get timeline entry by ID
// @route   GET /api/timeline/:id
// @access  Public
const getTimelineById = asyncHandler(async (req, res) => {
  const timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    res.status(404);
    throw new Error('Timeline entry not found');
  }

  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc    Create a new timeline entry
// @route   POST /api/timeline
// @access  Private/Admin
const createTimeline = asyncHandler(async (req, res) => {
  try {
    const { title, description, date, isKeyMilestone, impact, achievement } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Handle image uploads if files are provided
    let gallery = [];
    if (req.files && req.files.gallery) {
      // Convert to array if it's a single file
      const galleryFiles = Array.isArray(req.files.gallery) ? req.files.gallery : [req.files.gallery];

      // Process each file and add to gallery array
      gallery = galleryFiles.map(file => ({
        filePath: file.path,
        publicId: file.filename,
        fileType: file.mimetype
      }));

      console.log(`Processed ${gallery.length} gallery files for timeline`);
    } else if (req.body.galleryData) {
      // If gallery data is provided in JSON string
      try {
        gallery = JSON.parse(req.body.galleryData);
        console.log(`Using ${gallery.length} existing gallery URLs from galleryData`);

        // Ensure each gallery item is correctly formatted as an object with required fields
        gallery = gallery.map(item => {
          // If the item is already correctly formatted, return it as is
          if (typeof item === 'object' && item.filePath) {
            return item;
          }
          // If it's a string URL, convert it to proper format
          if (typeof item === 'string') {
            return {
              filePath: item,
              publicId: item.split('/').pop().split('.')[0], // Extract a publicId from URL
              fileType: 'image' // Default to image type
            };
          }
          return item;
        });
      } catch (e) {
        console.error('Error parsing galleryData:', e);
      }
    }

    // Upload any base64 encoded images to Cloudinary
    if (gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i].data && gallery[i].data.startsWith('data:image')) {
          try {
            const result = await cloudinary.uploader.upload(gallery[i].data, {
              folder: 'rashtriya_kishan_manch/timeline',
              resource_type: 'image'
            });

            gallery[i] = {
              filePath: result.secure_url,
              publicId: result.public_id,
              fileType: 'image'
            };
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            // Keep the original data if upload fails
          }
        }
      }
    }

    // Create the timeline entry
    const timeline = await Timeline.create({
      title,
      description,
      date,
      gallery,
      isKeyMilestone: isKeyMilestone === 'true' || isKeyMilestone === true,
      impact: impact || '',
      achievement: achievement || ''
    });

    res.status(201).json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Error in createTimeline controller:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update timeline entry
// @route   PUT /api/timeline/:id
// @access  Private/Admin
const updateTimeline = asyncHandler(async (req, res) => {
  try {
    let timeline = await Timeline.findById(req.params.id);

    if (!timeline) {
      res.status(404);
      throw new Error('Timeline entry not found');
    }

    let { title, description, date, isKeyMilestone, impact, achievement } = req.body;

    // Normalize isKeyMilestone to a proper Boolean
    if (typeof isKeyMilestone === 'string') {
      if (isKeyMilestone.toLowerCase() === 'true') isKeyMilestone = true;
      else if (isKeyMilestone.toLowerCase() === 'false') isKeyMilestone = false;
      else isKeyMilestone = false; // or: delete isKeyMilestone;
    }

    let updatedData = { title, description, date, isKeyMilestone, impact, achievement };


    // Handle image uploads if files are provided
    if (req.files && req.files.gallery) {
      // Convert to array if it's a single file
      const galleryFiles = Array.isArray(req.files.gallery) ? req.files.gallery : [req.files.gallery];

      // Process each file and add to gallery array
      updatedData.gallery = galleryFiles.map(file => ({
        filePath: file.path,
        publicId: file.filename,
        fileType: file.mimetype
      }));

      console.log(`Processed ${updatedData.gallery.length} gallery files for timeline update`);
    } else if (req.body.galleryData) {
      // If gallery data is provided in JSON string
      try {
        let galleryData = JSON.parse(req.body.galleryData);
        console.log(`Using ${galleryData.length} existing gallery URLs for timeline update`);

        // Ensure each gallery item is correctly formatted as an object with required fields
        updatedData.gallery = galleryData.map(item => {
          // If the item is already correctly formatted, return it as is
          if (typeof item === 'object' && item.filePath) {
            return item;
          }
          // If it's a string URL, convert it to proper format
          if (typeof item === 'string') {
            return {
              filePath: item,
              publicId: item.split('/').pop().split('.')[0], // Extract a publicId from URL
              fileType: 'image' // Default to image type
            };
          }
          return item;
        });
      } catch (e) {
        console.error('Error parsing galleryData for update:', e);
      }
    }

    // Upload any base64 encoded images to Cloudinary
    if (updatedData.gallery && updatedData.gallery.length > 0) {
      for (let i = 0; i < updatedData.gallery.length; i++) {
        if (updatedData.gallery[i].data && updatedData.gallery[i].data.startsWith('data:image')) {
          try {
            const result = await cloudinary.uploader.upload(updatedData.gallery[i].data, {
              folder: 'rashtriya_kishan_manch/timeline',
              resource_type: 'image'
            });

            updatedData.gallery[i] = {
              filePath: result.secure_url,
              publicId: result.public_id,
              fileType: 'image'
            };
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            // Keep the original data if upload fails
          }
        }
      }
    }

    timeline = await Timeline.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Error updating timeline entry:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete timeline entry
// @route   DELETE /api/timeline/:id
// @access  Private/Admin
const deleteTimeline = asyncHandler(async (req, res) => {
  const timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    res.status(404);
    throw new Error('Timeline entry not found');
  }

  // Delete images from Cloudinary if they exist
  if (timeline.gallery && timeline.gallery.length > 0) {
    for (const image of timeline.gallery) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
          // Continue with deletion even if Cloudinary delete fails
        }
      }
    }
  }

  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getTimelines,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline
}; 