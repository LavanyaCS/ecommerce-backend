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

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.find({ user: req.user._id }).populate("category", "title description");

    if (!product || product.length === 0) {
      return res.status(400).json({ message: "No Product is found" });
    }

    res.status(200).json({ message: "Product List", productInfo: product });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
  }
};
