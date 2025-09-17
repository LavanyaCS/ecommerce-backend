const express = require("express");
const { getWishlist, toggleWishlist, addWishlist, removeWishlist } = require("../controllers/wishlistController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",authMiddleware(),getWishlist);
router.post("/toggle",authMiddleware(),toggleWishlist);
router.post("/",authMiddleware(),addWishlist);
router.delete("/",authMiddleware(),removeWishlist)


module.exports = router;