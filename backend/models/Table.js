const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Please provide a table number'],
    unique: true
  },
  seats: {
    type: Number,
    required: [true, 'Please provide number of seats']
  },
  qrCode: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
