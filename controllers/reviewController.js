const Review = require("../models/reviewModel");

//add Review
exports.addReview = async (req, res) => {
    try {
        const { rating, comment, product } = req.body;
        if (!rating || !product) {
            return res.status(400).json({ message: "Rating and Product are required" });
        }
        const existingreview = await Review.findOne({ user: req.user._id, product });
        if (existingreview) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }
        const review = await Review.create({
            rating, comment, product, user:req.user._id
        });

        res.status(201).json({
            message: "Review Added Successfully",
            review
        });
    }

    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }

}
//update Review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;
        const review = await Review.findOneAndUpdate(
            { user: req.user._id, _id:reviewId },
            req.body,
            {new:true}).populate("product user");
        if (!review) {
            return res.status(404).json({
                message: "Review not found or you are not authorized"
            });
        }
        res.status(200).json({
            message: "Review Updated Successfully",
            review
        });
    }

    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }

}
//delete Review
exports.deleteReview = async (req,res) => {
    try{
        const { reviewId } = req.params;
    const review = await Review.findOneAndDelete({
        user:req.user._id,
        _id:reviewId
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found or you are not authorized" });
    }

    res.status(200).json({ message: "Review deleted", review });
}
 catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}

//ReadReview
exports.getReview = async(req,res) => {
    try{
        // const { rating,comment,product } = req.body;
        const reviews = await Review.find().populate("product").populate("user");
        if(reviews.length === 0){
            return res.status(404).json({message:"No review is found"});
        }
        res.status(200).json({
            message:"Review List",
            reviews
        })

    }
    
 catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}