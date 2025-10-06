const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, subtotal, totalAmount } = req.body;

    if (!orderItems || !orderItems.length) {
      return res.status(400).json({ message: "Order Items are required" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const populatedOrderItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });

      populatedOrderItems.push({
        product: product._id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
        image: Array.isArray(product.image) ? product.image[0] : product.image
      });
    }

    // 💰 Determine payment status based on method
    let paymentStatus = "pending";
    if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card" || paymentMethod === "UPI") {
      paymentStatus = "paid"; // Assume payment success after gateway returns success
    } else if (paymentMethod === "COD") {
      paymentStatus = "pending"; // Will be marked paid after delivery
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedOrderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      subtotal: subtotal || 0,
      totalAmount: totalAmount || subtotal || 0
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
//Get orders for logged-in user
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

//Get all orders (admin)
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

//Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "delivered" && order.paymentMethod === "COD") {
        order.paymentStatus = "paid"; 
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};

//Update payment status (admin or payment callback)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: "Payment status updated", order });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};

//Delete order (admin)
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
