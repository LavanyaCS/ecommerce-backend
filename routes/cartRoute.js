const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

// All cart routes require login
router.use(authMiddleware());
///

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);
router.delete("/clear", clearCart);

module.exports = router;
