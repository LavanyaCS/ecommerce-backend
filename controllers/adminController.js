const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");

// Get all products for admin
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "title description")
      .populate("user", "name email role"); // seller info
console.log(res.data);
    res.status(200).json({ message: "All products", products: products });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Product stats by category
exports.getProductStatsByCategory = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "title");
    const stats = {};
    products.forEach(p => {
      const cat = p.category?.title || "Uncategorized";
      stats[cat] = (stats[cat] || 0) + 1;
    });

    const chartData = Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
    res.status(200).json({ message: "Product stats by category", chartData });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Product stats by seller
exports.getProductStatsBySeller = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email");
    const stats = {};
    products.forEach(p => {
      const seller = p.user?.name || "Unknown Seller";
      stats[seller] = (stats[seller] || 0) + 1;
    });

    const chartData = Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
    res.status(200).json({ message: "Product stats by seller", chartData });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Total Revenue (only paid/completed orders)
    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } }, // only paid orders
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Total Users & Sellers
const totalUsers = await User.countDocuments({ role: "buyer" });
const totalSellers = await User.countDocuments({ role: "seller" });


    // Total Products
    const totalProducts = await Product.countDocuments();

    // Products per Seller
    const productsPerSellerAgg = await Product.aggregate([
      {
        $group: {
          _id: "$user", // your product schema uses "user" for seller reference
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
      { $unwind: { path: "$sellerInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sellerName: { $ifNull: ["$sellerInfo.name", "Unknown Seller"] },
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      totalRevenue,
      totalUsers,
      totalSellers,
      totalProducts,
      productsPerSeller: productsPerSellerAgg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};