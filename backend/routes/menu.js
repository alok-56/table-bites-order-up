const express = require('express');
const {
  getCategories,
  createCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/items', getMenuItems);
router.get('/categories', getCategories);
router.get('/items/:id', getMenuItem);

// Protected admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/categories')
  .post(createCategory);

router.route('/categories/:id')
  .delete(deleteCategory);

router.route('/items')
  .post(createMenuItem);

router.route('/items/:id')
  .put(updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router;
