const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    label: { type: String, default: "Home" }, 
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zip: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false }
});

const Address = mongoose.model("Address",addressSchema);
module.exports = Address;