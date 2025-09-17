const express = require("express");
const { registerUser, loginUser, getuserList } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/userlist",authMiddleware(),getuserList);

module.exports = router;