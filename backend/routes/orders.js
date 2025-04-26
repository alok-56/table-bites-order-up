const express = require('express');
const {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  getOrdersByTable,
  getOrdersByStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (needed for customer ordering)
router.post('/', createOrder);
router.get('/table/:tableId', getOrdersByTable);

// Protected routes (admin and kitchen)
router.use(protect);

router.get('/', getOrders);
router.get('/status/:status', getOrdersByStatus);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

module.exports = router;
