require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    description: "Comfortable Bluetooth headphones with clear sound and long battery life.",
    price: 2499,
    category: "Electronics",
    image: "https://placehold.co/600x400?text=Headphones",
    stock: 20
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with notifications and heart-rate monitoring.",
    price: 3999,
    category: "Electronics",
    image: "https://placehold.co/600x400?text=Smart+Watch",
    stock: 15
  },
  {
    name: "Running Shoes",
    description: "Lightweight everyday running shoes with comfortable cushioning.",
    price: 2999,
    category: "Fashion",
    image: "https://placehold.co/600x400?text=Running+Shoes",
    stock: 30
  },
  {
    name: "Backpack",
    description: "Durable laptop backpack suitable for college, work and travel.",
    price: 1499,
    category: "Fashion",
    image: "https://placehold.co/600x400?text=Backpack",
    stock: 25
  },
  {
    name: "Coffee Maker",
    description: "Compact coffee maker for quick and easy home brewing.",
    price: 3299,
    category: "Home",
    image: "https://placehold.co/600x400?text=Coffee+Maker",
    stock: 10
  },
  {
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness settings.",
    price: 899,
    category: "Home",
    image: "https://placehold.co/600x400?text=Desk+Lamp",
    stock: 40
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  await User.findOneAndUpdate(
    { email: "admin@example.com" },
    {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin"
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "user@example.com" },
    {
      name: "Demo User",
      email: "user@example.com",
      password: userPassword,
      role: "user"
    },
    { upsert: true, new: true }
  );

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log("Seed completed.");
  console.log("Admin: admin@example.com / Admin@123");
  console.log("User: user@example.com / User@123");

  await mongoose.disconnect();
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
