const Wishlist = require("../models/wishlistModel");

// Add product to wishlist
exports.addWishlist = async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) return res.status(400).json({ message: "Product ID is required" });

        const existing = await Wishlist.findOne({ user: req.user._id, product });
        if (existing) return res.status(400).json({ message: "Product already in wishlist" });

        const wishlist = await Wishlist.create({ user: req.user._id, product });
        const populatedWishlist = await wishlist.populate("product");

        res.status(201).json({ message: "Product added to wishlist", wishlist: populatedWishlist });
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

// Remove product from wishlist
exports.removeWishlist = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;
        if (!productId) return res.status(400).json({ message: "Product ID is required" });

        const wishlist = await Wishlist.findOneAndDelete({ user: req.user._id, product: productId });
        if (!wishlist) return res.status(404).json({ message: "Product not found in wishlist" });

        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

// Get all wishlist items for user
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user._id }).populate("product");
        res.status(200).json({ message: "Wishlist retrieved successfully", wishlist });
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

// Toggle product in wishlist
exports.toggleWishlist = async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) return res.status(400).json({ message: "Product ID is required" });

        const existing = await Wishlist.findOne({ user: req.user._id, product });

        if (existing) {
            await Wishlist.findByIdAndDelete(existing._id);
            return res.status(200).json({ message: "Product removed from wishlist", removed: true });
        }

        const wishlist = await Wishlist.create({ user: req.user._id, product });
        const populatedWishlist = await wishlist.populate("product");

        res.status(201).json({ message: "Product added to wishlist", wishlist: populatedWishlist, removed: false });
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};
