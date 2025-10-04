const express = require("express");
const { createProduct, updateProduct, deleteProduct, getProductById, getProduct, getProductsByCategory, getProductsBySeller, getwithoutsortProduct } = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllProducts } = require("../controllers/adminController");
const router = express.Router();

router.post("/",authMiddleware(["admin","seller"]),createProduct);
router.put("/:id",authMiddleware(["admin","seller"]),updateProduct);
router.delete("/:id",authMiddleware(["admin","seller"]),deleteProduct);
router.get("/",getProduct);
//Based on category filter
router.get("/category/:categoryId", getProductsByCategory);
//Seller
router.get("/seller/products", authMiddleware(["seller"]), getProductsBySeller);
router.get("/:id",getProductById);


module.exports = router;