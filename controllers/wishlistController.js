const Wishlist = require("../models/wishlistModel");

//Add Wishlist
exports.addWishlist = async (req, res) => {
    try {
        const { product } = req.body;

        if (!product) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const existingWishlist = await Wishlist.findOne({ user: req.user._id, product });
        if (existingWishlist) {
            return res.status(400).json({ message: "Product is already exists in wishlist" });
        }
        const wishlist = await Wishlist.create({
            user: req.user._id,
            product
        })
        res.status(201).json({
            message: "Product added to Wishlist",
            wishlist
        })

    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}
//Remove Wishlist
exports.removeWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const wishlist = await Wishlist.findOneAndDelete({
            user: req.user._id,
            product: productId
        });
        if (!wishlist) {
            return res.status(404).json({ message: "Product not found in wishlist" })
        }
        res.status(200).json({
            message: "Product removed from wishlist",
            wishlist
        });
    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }


}
//Read Wishlist
exports.getWishlist = async (req, res) => {
    try {

        const wishlist = await Wishlist.find({
            user: req.user._id
        }).populate("product");
        res.status(200).json({
            message: "Product Wishlist List",
            wishlist
        })
    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}
//toggle Wishlist

exports.toggleWishlist = async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) {
            return res.status(400).json({ message: "Product ID is Required  " });
        }
        // Check if product is already in wishlist
        const existingWishlist = await Wishlist.findOne({
            user: req.user._id,
            product,
        });
        if (existingWishlist) {
            await Wishlist.findByIdAndDelete(existingWishlist._id);

            return res.status(200).json({
                message: "Product removed from wishlist",
                removed: true,
            });
        }
        else {
            const wishlist = await Wishlist.create({
                user: req.user._id,
                product
            })
            // Populate product details before sending response (optional, but useful)
            const populatedWishlist = await wishlist.populate("product");

            return res.status(201).json({
                message: "Product added to wishlist",
                wishlist: populatedWishlist,
                removed: false,
            });
        }
    }

    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}