const express = require("express");
const { createProduct, updateProduct, deleteProduct, getProductById, getProduct } = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware(["admin","seller"]),createProduct);
router.put("/:id",authMiddleware(["admin","seller"]),updateProduct);
router.delete("/:id",authMiddleware(["admin","seller"]),deleteProduct);
router.get("/",getProduct);
router.get("/:id",getProductById);


module.exports = router;