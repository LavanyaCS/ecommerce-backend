const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    rating:{type:Number,required:true},
    comment:{type:String,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"}
},{ timestamps: true });

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("review",reviewSchema);
module.exports = Review;