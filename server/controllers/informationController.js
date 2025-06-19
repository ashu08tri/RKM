const Information = require('../models/Information');
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get all information items
// @route   GET /api/information
// @access  Public
exports.getInformationItems = async (req, res) => {
  try {
    const items = await Information.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create an information item
// @route   POST /api/information
// @access  Private/Admin
exports.createInformationItem = async (req, res) => {
  try {
    const { title, content, status, category } = req.body;
    let imageUrl, imagePublicId;

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const item = await Information.create({
      title,
      content,
      status,
      category,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an information item
// @route   PUT /api/information/:id
// @access  Private/Admin
exports.updateInformationItem = async (req, res) => {
  try {
    let item = await Information.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const updatedData = { ...req.body };

    if (req.file) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }
      updatedData.imageUrl = req.file.path;
      updatedData.imagePublicId = req.file.filename;
    }

    item = await Information.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an information item
// @route   DELETE /api/information/:id
// @access  Private/Admin
exports.deleteInformationItem = async (req, res) => {
  try {
    const item = await Information.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
