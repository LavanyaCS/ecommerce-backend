const mongoose = require("mongoose");
//Schema 

const wishlistSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
},{timestamps:true});

// Prevent duplicate product per user
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist",wishlistSchema);
module.exports = Wishlist;