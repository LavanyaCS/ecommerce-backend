const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { addReview, updateReview, deleteReview, getReview } = require("../controllers/reviewController");
const router = express.Router();

router.post("/",authMiddleware(),addReview);
router.put("/:reviewId",authMiddleware(),updateReview);
router.delete("/:reviewId",authMiddleware(),deleteReview);
router.get("/",getReview);


module.exports = router;