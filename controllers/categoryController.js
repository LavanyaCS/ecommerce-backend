const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { title, description,image } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
 const categoryExists = await Category.findOne({ title });
    if (categoryExists) {
      return res.status(404).json({ message: "Category is already found" });
    }
    const category = await Category.create({
      title,
      description,image,
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
const productCount = await Product.countDocuments({ category: req.params.id });
if (productCount > 0) {
  return res.status(400).json({
    message: `Cannot delete category. There are ${productCount} product(s) under this category.`,
  });
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
    const category = await Category.find();

    if (!category || category.length === 0) {
      return res.status(400).json({ message: "No Category is found" });
    }

    res.status(200).json({ message: "Category List", categoryInfo: category });

  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error.message}` });
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
