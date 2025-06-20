const InformationGroup = require('../models/Information'); // updated model
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get all information groups
// @route   GET /api/information
// @access  Public
exports.getInformationItems = async (req, res) => {
  try {
    const groups = await InformationGroup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create an item inside a group
// @route   POST /api/information/:groupTitle
// @access  Private/Admin
exports.createInformationItem = async (req, res) => {
  try {
    const {
      groupTitle,
      title,
      description,
      category,
      region,
      engagementMetric,
      fileType,
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.path;
    }

    let group = await InformationGroup.findOne({ groupTitle });

    const newItem = {
      title,
      description,
      category,
      region,
      image,
      engagementMetric,
      fileType,
    };

    if (!group) {
      // create the group if it doesn't exist
      group = await InformationGroup.create({
        groupTitle,
        items: [newItem],
      });
    } else {
      // push to existing group's items
      group.items.push(newItem);
      await group.save();
    }

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an item inside a group
// @route   PUT /api/information/:groupTitle/:itemId
// @access  Private/Admin
exports.updateInformationItem = async (req, res) => {
  try {
    const { groupTitle, id: itemId } = req.params;
    const updatedFields = req.body;

    const group = await InformationGroup.findOne({ groupTitle });
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    const itemIndex = group.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Item not found in group' });
    }

    if (req.file) {
      updatedFields.image = req.file.path;
    }

    group.items[itemIndex] = {
      ...group.items[itemIndex]._doc,
      ...updatedFields,
    };

    await group.save();
    res.status(200).json({ success: true, data: group.items[itemIndex] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an item inside a group
// @route   DELETE /api/information/:groupTitle/:itemId
// @access  Private/Admin
// DELETE /api/information/:groupTitle/:itemId
exports.deleteInformationItem = async (req, res) => {
  try {
    const { groupTitle, id:itemId } = req.params;

    const group = await InformationGroup.findOne({ groupTitle });
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    console.log('Requested itemId:', itemId);
    console.log('All item._id in group:', group.items.map(i => i._id.toString()));


    const item = group.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found in group' });
    }

    // delete image from Cloudinary
    // if (group.items[itemIndex].imagePublicId) {
    //   await cloudinary.uploader.destroy(group.items[itemIndex].imagePublicId);
    // }

    item.deleteOne(); // removes the subdocument
    await group.save();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


