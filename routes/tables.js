
const express = require('express');
const { 
  getTables,
  createTable, 
  getTable, 
  updateTable, 
  deleteTable,
  regenerateQRCode
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only routes
router.route('/')
  .get(getTables)
  .post(authorize('admin'), createTable);

router.route('/:id')
  .get(getTable)
  .put(authorize('admin'), updateTable)
  .delete(authorize('admin'), deleteTable);

router.post('/:id/qrcode', authorize('admin'), regenerateQRCode);

module.exports = router;
