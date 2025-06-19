const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    required: [true, 'Filename is required'] // e.g., media_programs_2025_01.jpg
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'] // Path where the file is stored
  },
  thumbnailFileName: {
    type: String,
    default: '' // For storing the thumbnail filename, particularly for videos
  },
  thumbnailPath: {
    type: String,
    default: '' // Path where the thumbnail is stored
  },
  fileType: {
    type: String,
    enum: ['image', 'video', 'document', 'audio'],
    default: 'image'
  },
  category: { // Helps in associating with sections like 'Our Vision' tabs or 'Team'
    type: String,
    default: 'MediaTab'
  },
  tabAssociation: { // More specific association if needed, e.g., a particular program name
    type: String,
    default: ''
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the admin user who uploaded it
    required: true
  },
  // New fields for video media
  duration: {
    type: String,
    default: ''  // Format: "MM:SS"
  },
  viewCount: {
    type: Number,
    default: 0
  },
  // Support for multiple gallery images
  gallery: [{
    type: String  // Array of image URLs/paths
  }],
  // Add mediaUrl virtual property for consistent frontend rendering
  mediaUrl: {
    type: String,
    get: function() {
      return this.filePath;
    }
  },
  thumbnailUrl: {
    type: String,
    get: function() {
      return this.thumbnailPath || this.filePath; // Fall back to main file if no thumbnail
    }
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt fields automatically
  toJSON: { 
    virtuals: true,
    getters: true 
  },
  toObject: { 
    virtuals: true, 
    getters: true 
  }
});

module.exports = mongoose.model('Media', mediaSchema);
