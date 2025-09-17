const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true},
    role:{type:String,enum:["buyer","seller","admin"],default: "buyer"},
    phone: { type: String },
    isActive: { type: Boolean, default: true }
},{ timestamps: true } );


module.exports = mongoose.model("User",userSchema);
