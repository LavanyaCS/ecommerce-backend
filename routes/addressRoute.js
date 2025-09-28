const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/addressController");

// Apply authentication to all routes
router.use(authMiddleware());

// Routes
router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/default/:addressId", setDefaultAddress); 
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

module.exports = router;
