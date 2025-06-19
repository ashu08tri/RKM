const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  gallery: [{
    filePath: String,
    publicId: String,
    fileType: String
  }],
  isKeyMilestone: {
    type: Boolean,
    default: false
  },
  impact: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline; 