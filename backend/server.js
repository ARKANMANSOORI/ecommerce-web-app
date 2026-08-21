require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  isConnected = true;
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

module.exports = app;