// routes/adminRoutes.js
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getAllProducts,
  getProductStatsByCategory,
  getProductStatsBySeller,
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

// Only admin can access these routes
router.get("/products", authMiddleware(["admin"]), getAllProducts);
router.get("/products/stats/category", authMiddleware(["admin"]), getProductStatsByCategory);
router.get("/products/stats/seller", authMiddleware(["admin"]), getProductStatsBySeller);
router.get("/dashboard", authMiddleware(["admin"]), getDashboardStats);

module.exports = router;
