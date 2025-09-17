const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    quantity:{type:Number,required:true,min:0},
    price:{type:Number,required:true,min:0},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
});

const Product = mongoose.model("Product",productSchema);
module.exports = Product;