
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// Get all categories
// @route GET /api/menu/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new category
// @route POST /api/menu/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    
    // Create category
    const category = await Category.create({ name });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a category
// @route DELETE /api/menu/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Check if any menu items are using this category
    const menuItemsCount = await MenuItem.countDocuments({ category: req.params.id });
    
    if (menuItemsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with associated menu items' 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all menu items
// @route GET /api/menu/items
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate('category', 'name');
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new menu item
// @route POST /api/menu/items
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category, available } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image,
      category,
      available: available !== undefined ? available : true
    });
    
    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single menu item
// @route GET /api/menu/items/:id
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('category', 'name');
    
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a menu item
// @route PUT /api/menu/items/:id
exports.updateMenuItem = async (req, res) => {
  try {
    // If category is being updated, check if it exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
    }
    
    // Update menu item
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name');
    
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a menu item
// @route DELETE /api/menu/items/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    await MenuItem.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
