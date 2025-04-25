
const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// Get all orders
// @route GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    // Default sort by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { tableId, items, notes } = req.body;
    
    // Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    
    // Validate items and calculate total
    let total = 0;
    const validatedItems = [];
    
    for (const item of items) {
      // Check if menu item exists and is available
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(404).json({ 
          success: false, 
          message: `Menu item with ID ${item.menuItemId} not found` 
        });
      }
      
      if (!menuItem.available) {
        return res.status(400).json({
          success: false,
          message: `Menu item "${menuItem.name}" is not available`
        });
      }
      
      // Add item to validated items
      validatedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      });
      
      // Calculate total
      total += menuItem.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      tableId,
      tableNumber: table.number,
      items: validatedItems,
      status: 'pending',
      total,
      notes
    });
    
    // Update table status to occupied
    await Table.findByIdAndUpdate(tableId, { status: 'occupied' });
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single order
// @route GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
// @route PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Update order status
    order.status = status;
    await order.save();
    
    // If order is delivered or canceled, update table status to available
    if (status === 'delivered' || status === 'canceled') {
      // Check if there are other active orders for this table
      const activeOrders = await Order.countDocuments({
        tableId: order.tableId,
        status: { $nin: ['delivered', 'canceled'] },
        _id: { $ne: order._id }
      });
      
      // If no other active orders, set table to available
      if (activeOrders === 0) {
        await Table.findByIdAndUpdate(order.tableId, { status: 'available' });
      }
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders by table
// @route GET /api/orders/table/:tableId
exports.getOrdersByTable = async (req, res) => {
  try {
    const orders = await Order.find({ 
      tableId: req.params.tableId,
      status: { $nin: ['delivered', 'canceled'] }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders by status
// @route GET /api/orders/status/:status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'canceled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const orders = await Order.find({ status }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
