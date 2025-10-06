const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [], totalPrice: 0 } });
    }
    res.status(200).json({ message: "User cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { product: productId, quantity } = req.body;
    if (!productId || quantity < 1)
      return res.status(400).json({ message: "Invalid product or quantity" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

// Fetch all products in cart
const productIds = cart.items.map(item => item.product);
const products = await Product.find({ _id: { $in: productIds } });

// Recalculate totalPrice safely
cart.totalPrice = cart.items.reduce((acc, item) => {
  const prod = products.find(p => p._id.toString() === item.product.toString());
  if (!prod) return acc; // skip if product no longer exists
  return acc + prod.price * item.quantity;
}, 0);
     
    }

    await cart.save();
    cart = await cart.populate("items.product");
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, stack: err.stack });
    res.status(500).json({ message: "Server Error" });
  }
};
exports.updateCartItem = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Invalid quantity" });

    // Populate items.product to easily access price
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the item to update, skip null products
    const itemIndex = cart.items.findIndex(
      item => item.product && item.product._id.toString() === productId
    );
    if (itemIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Remove items where product no longer exists
    cart.items = cart.items.filter(item => item.product !== null);

    // Recalculate totalPrice safely
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};


// Remove item
exports.removeCartItem = async (req, res) => {
  try {
    const productId = req.params.id; //read from URL param
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

    cart.items.splice(itemIndex, 1);

    // Recalculate totalPrice
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    // Create a new empty cart if none exists
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    } else {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
