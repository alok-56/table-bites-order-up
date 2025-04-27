
const Table = require('../models/Table');

// Get all tables
// @route GET /api/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new table
// @route POST /api/tables
exports.createTable = async (req, res) => {
  try {
    const { number, seats, status } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ success: false, message: 'Table number already exists' });
    }

    // Create table
    const table = await Table.create({
      number,
      seats,
      status: status || 'available'
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single table
// @route GET /api/tables/:id
exports.getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a table
// @route PUT /api/tables/:id
exports.updateTable = async (req, res) => {
  try {
    let table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // Update table
    table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a table
// @route DELETE /api/tables/:id
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
