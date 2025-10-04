const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { addReview, updateReview, deleteReview, getReview, getAllReviews } = require("../controllers/reviewController");
const router = express.Router();

router.post("/",authMiddleware(),addReview);
router.put("/:reviewId",authMiddleware(),updateReview);
router.delete("/:reviewId",authMiddleware(),deleteReview);
router.get("/",getReview);
router.get("/all",getAllReviews);


module.exports = router;