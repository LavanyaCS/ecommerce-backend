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

// Routes
router.get("/", getCart);             // GET /cart             -> get user cart
router.post("/", addToCart);          // POST /cart            -> add item to cart
router.delete("/clear", clearCart);   // DELETE /cart/clear    -> clear cart
router.put("/:id", updateCartItem);   // PUT /cart/:id         -> update item quantity
router.delete("/:id", removeCartItem);// DELETE /cart/:id      -> remove item


module.exports = router;
