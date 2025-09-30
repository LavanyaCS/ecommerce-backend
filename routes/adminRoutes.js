const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllProducts, getProductStatsByCategory, getProductStatsBySeller } = require("../controllers/adminController");

const router = express.Router();

// Only admin access
router.get("/products", authMiddleware(["admin"]), getAllProducts);
router.get("/products/stats/category", authMiddleware(["admin"]), getProductStatsByCategory);
router.get("/products/stats/seller", authMiddleware(["admin"]), getProductStatsBySeller);

module.exports = router;
