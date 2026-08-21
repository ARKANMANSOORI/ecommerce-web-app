const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Could not load cart" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    if (!productId || qty < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const item = cart.items.find(i => i.product.toString() === productId);

    if (item) {
      if (item.quantity + qty > product.stock) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      item.quantity += qty;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: "Could not add to cart" });
  }
});

router.put("/:productId", protect, async (req, res) => {
  try {
    const qty = Number(req.body.quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (qty > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = qty;
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: "Could not update cart" });
  }
});

router.delete("/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: "Could not remove item" });
  }
});

router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true }
    );
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Could not clear cart" });
  }
});

module.exports = router;
