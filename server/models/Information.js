const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required.'],
  },
  imageUrl: {
    type: String,
    required: false, 
  },
  imagePublicId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  category: {
    type: String,
    enum: ['Article', 'Announcement', 'News'],
    default: 'Article',
  }
}, { timestamps: true });

module.exports = mongoose.model('Information', InformationSchema);
