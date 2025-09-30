const Product = require("../models/productModel");
const User = require("../models/userModel"); // if you want seller info
const Category = require("../models/categoryModel");

// Get all products for admin
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "title description")
      .populate("user", "name email role"); // populate seller info

    res.status(200).json({
      message: "All products",
      productInfo: products,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Optionally, get stats per category
exports.getProductStatsByCategory = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "title");

    const stats = {};
    products.forEach(p => {
      const cat = p.category?.title || "Uncategorized";
      stats[cat] = (stats[cat] || 0) + 1;
    });

    const chartData = Object.keys(stats).map(key => ({
      name: key,
      value: stats[key],
    }));

    res.status(200).json({
      message: "Product stats by category",
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Optionally, get stats per seller
exports.getProductStatsBySeller = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email");

    const stats = {};
    products.forEach(p => {
      const seller = p.user?.name || "Unknown Seller";
      stats[seller] = (stats[seller] || 0) + 1;
    });

    const chartData = Object.keys(stats).map(key => ({
      name: key,
      value: stats[key],
    }));

    res.status(200).json({
      message: "Product stats by seller",
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
