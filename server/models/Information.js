const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['subsidy', 'certification', 'insurance', 'seasonal', 'sustainable', 'weather'],
    default: 'subsidy',
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  region: {
    type: String,
    default: 'national',
  },
  image: {
    type: String,
  },
  engagementMetric: {
    type: Number,
    default: 0,
  },
  fileType: {
    type: String,
    enum: ['document', 'image', 'video'],
    default: 'document',
  },
});

const InformationGroupSchema = new mongoose.Schema({
  groupTitle: {
    type: String,
    enum: ['governmentSchemes', 'agriculturalResources', 'educationalMaterials', 'newsUpdates'],
    required: true,
    unique: true,
  },
  items: [ItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('InformationGroup', InformationGroupSchema);
