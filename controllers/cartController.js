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
    // const { productId, quantity } = req.body;
const { product: productId, quantity } = req.body;

    if (!productId || quantity < 1) 
      return res.status(400).json({ message: "Invalid product or quantity" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // Fetch all products in cart at once
      const productIds = cart.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });

      // Recalculate totalPrice
      cart.totalPrice = cart.items.reduce((acc, item) => {
        const prod = products.find(p => p._id.toString() === item.product.toString());
        return acc + (prod.price * item.quantity);
      }, 0);
    }

    await cart.save();
    cart = await cart.populate("items.product");
    res.status(200).json({ message: "Item added to cart", cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    // const { productId, quantity } = req.body;
    
const { product: productId, quantity } = req.body;

    if (!productId || quantity < 1) return res.status(400).json({ message: "Invalid product or quantity" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

    cart.items[itemIndex].quantity = quantity;

    // recalculate totalPrice
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

    cart.items.splice(itemIndex, 1);

    // recalculate totalPrice
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
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
