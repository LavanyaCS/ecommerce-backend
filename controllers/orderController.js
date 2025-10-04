const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, subtotal, totalAmount } = req.body;
console.log("User:", req.user._id);
console.log("Order Payload:", req.body);
    if (!orderItems || !orderItems.length) {
      return res.status(400).json({ message: "Order Items are required" });
    }

    // Validate shippingAddress is an ObjectId
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const populatedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });

      populatedOrderItems.push({
        product: product._id,
        title: product.title,               // required
        quantity: item.quantity,
        price: product.price,               // required
        image: Array.isArray(product.image) ? product.image[0] : product.image
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedOrderItems,
      shippingAddress,                     // must be ObjectId of saved address
      paymentMethod,
      subtotal: subtotal || 0,
      totalAmount: totalAmount || subtotal || 0
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// ✅ Get orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("shippingAddress")    // Address ref
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders fetched successfully",
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// ✅ Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// orderController.js
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("orderItems.product")
      .populate("shippingAddress")
      .populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ message: "Order status is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};
// ✅ Delete order (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
