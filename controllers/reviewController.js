const Review = require("../models/reviewModel");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, product } = req.body;
    if (!rating || !product) {
      return res.status(400).json({ message: "Rating and Product are required" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: req.user._id, product });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      rating,
      comment,
      product,
      user: req.user._id,
    });

    // Populate the user field (username/email) for frontend display
    const populatedReview = await review.populate("user", "username email");

    res.status(201).json({
      message: "Review Added Successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, _id: reviewId },
      updateData,
      { new: true }
    ).populate("user", "username email").populate("product", "title");

    if (!review) {
      return res.status(404).json({ message: "Review not found or you are not authorized" });
    }

    res.status(200).json({
      message: "Review Updated Successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      user: req.user._id,
      _id: reviewId,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found or you are not authorized" });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// Get Reviews for a specific product
exports.getReview = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const reviews = await Review.find({ product: productId })
      .populate("user", "username email")
      .populate("product", "title");

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    res.status(200).json({
      message: "Review List",
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};
