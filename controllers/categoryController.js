const Category = require("../models/categoryModel");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
 const categoryExists = await Category.findOne({ title });
    if (categoryExists) {
      return res.status(404).json({ message: "Category is already found" });
    }
    const category = await Category.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Category Created Successfully",
      categoryInfo: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ message: "No Category found with this ID for the user" });
    }

    res.status(200).json({
      message: "Category Updated Successfully",
      categoryInfo: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: "No Category found with this ID for the user" });
    }

    res.status(200).json({
      message: "Category Deleted Successfully",
      categoryInfo: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
// Get All Categories (Global)
exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }); // ✅ filtered
    res.status(200).json({
      message: "Category List",
      categoryInfo: categories,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Get Category By ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category Details",
      categoryInfo: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
