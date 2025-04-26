const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const Table = require('../models/Table');

// Create QR code for a table
const generateQRCode = async (tableId, tableNumber) => {
  const qrDirectory = path.join(__dirname, '../qrcodes');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(qrDirectory)) {
    fs.mkdirSync(qrDirectory, { recursive: true });
  }
  
  const qrPath = path.join(qrDirectory, `table_${tableNumber}.png`);
  const qrUrl = `/table/${tableId}`;
  
  try {
    // Generate QR code
    await QRCode.toFile(qrPath, qrUrl);
    return `/qrcodes/table_${tableNumber}.png`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

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
    const { number, seats } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ success: false, message: 'Table number already exists' });
    }

    // Create table
    let table = await Table.create({
      number,
      seats,
      status: 'available'
    });

    // Generate QR code
    const qrCodePath = await generateQRCode(table._id, number);
    
    // Update table with QR code path
    table.qrCode = qrCodePath;
    await table.save();

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

    // If table number was changed, regenerate QR code
    if (req.body.number && table.number !== req.body.number) {
      const qrCodePath = await generateQRCode(table._id, req.body.number);
      table.qrCode = qrCodePath;
      await table.save();
    }

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

    // Remove QR code file if it exists
    if (table.qrCode) {
      const qrPath = path.join(__dirname, '..', table.qrCode);
      if (fs.existsSync(qrPath)) {
        fs.unlinkSync(qrPath);
      }
    }

    await table.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Regenerate QR code for a table
// @route POST /api/tables/:id/qrcode
exports.regenerateQRCode = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    
    // Generate new QR code
    const qrCodePath = await generateQRCode(table._id, table.number);
    
    // Update table with new QR code path
    table.qrCode = qrCodePath;
    await table.save();

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
