const express = require("express");
const { createProduct, updateProduct, deleteProduct, getProductById, getProduct, getProductsByCategory, getProductsBySeller } = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware(["admin","seller"]),createProduct);
router.put("/:id",authMiddleware(["admin","seller"]),updateProduct);
router.delete("/:id",authMiddleware(["admin","seller"]),deleteProduct);
router.get("/",getProduct);
router.get("/:id",getProductById);
//Based on category filter
router.get("/category/:categoryId", getProductsByCategory);
//Seller
router.get("/seller/products", authMiddleware(["seller"]), getProductsBySeller);


module.exports = router;