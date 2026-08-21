const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { fullName, phone, address, city, postalCode, paymentMethod = "COD" } = req.body;

    if (!fullName || !phone || !address || !city || !postalCode) {
      return res.status(400).json({ message: "All shipping fields are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: "A product in your cart no longer exists" });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `${item.product.name} does not have enough stock`
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: { fullName, phone, address, city, postalCode },
      paymentMethod: paymentMethod === "ONLINE" ? "ONLINE" : "COD"
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create order" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders" });
  }
});

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders" });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const allowed = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Could not update order status" });
  }
});

module.exports = router;
