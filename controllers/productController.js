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
      products: populatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const allowedFields = ["title", "description", "quantity", "price", "image", "category"];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updatedProduct = await product.save();
    const populatedProduct = await updatedProduct.populate("category", "title description");

    res.status(200).json({
      message: "Product updated successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "title description");
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { sortBy = "createdAt", order = "desc", search = "", category } = req.query;

    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    // Build query
    const query = {};
    if (search) {
      // Search by title (case-insensitive)
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category; // filter by category if provided
    }

    const products = await Product.find(query).sort(sortOption).populate("category", "title");

    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; //product id from URL

    const product = await Product.findById(id).populate("category", "title description");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      products: product,
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
      products: products 
    });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Get products only for the logged-in seller
exports.getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id })
      .populate("category", "title description");

    res.status(200).json({
      message: "Products by seller",
      products: products,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
