const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, quantity, price, image ,category } = req.body;

    if (!title || !description || !quantity || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity <= 0 || price < 0) {
      return res.status(400).json({ message: "Quantity must be > 0 and Price must be >= 0" });
    }

    const product = await Product.create({
      title,
      description,
      quantity,
      price,image,
      category,
      user: req.user._id
    });

    const populatedProduct = await product.populate("category", "title description");

    res.status(201).json({
      message: "Product Created Successfully",
      productInfo: populatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate("category", "title description");

    if (!product) {
      return res.status(400).json({ message: "No Product is found under this id" });
    }

    res.status(200).json({
      message: "Product Updated successfully",
      productInfo: product
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete(
      { _id: req.params.id, user: req.user._id }
    ).populate("category", "title description");

    if (!product) {
      return res.status(400).json({ message: "No Product is found under this id" });
    }

    res.status(200).json({
      message: "Product Deleted successfully",
      productInfo: product
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.find().populate("category", "title description");

    if (!product || product.length === 0) {
      return res.status(400).json({ message: "No Product is found" });
    }

    res.status(200).json({ message: "Product List", productInfo: product });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // ✅ product id from URL

    const product = await Product.findById(id).populate("category", "title description");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      productInfo: product,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
// controller/productController.js
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId })
      .populate("category", "title description");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json({ 
      message: "Products by category", 
      productInfo: products 
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
