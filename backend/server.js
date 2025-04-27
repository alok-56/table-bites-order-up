
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Routes
const authRoutes = require("./routes/auth");
const tableRoutes = require("./routes/tables");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create directory for QR codes if it doesn't exist
const qrDirectory = path.join(__dirname, 'qrcodes');
if (!fs.existsSync(qrDirectory)) {
  fs.mkdirSync(qrDirectory, { recursive: true });
}

// Serve static files for QR codes
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});
