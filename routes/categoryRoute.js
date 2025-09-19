const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCategoryById, getCategory } = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware(["admin","seller"]),createCategory);
router.put("/:id",authMiddleware(["admin","seller"]),updateCategory);
router.delete("/:id",authMiddleware(["admin","seller"]),deleteCategory);
router.get("/",authMiddleware(),getCategory);
router.get("/:id",authMiddleware(["admin","seller"]),getCategoryById);


module.exports = router;