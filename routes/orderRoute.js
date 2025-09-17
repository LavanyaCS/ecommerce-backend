const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

router.post("/", authMiddleware(),createOrder);
router.get("/my-orders",authMiddleware(), getUserOrders);
router.get("/", authMiddleware(["admin"]), getAllOrders);
router.put("/:orderId/status", authMiddleware(["admin"]), updateOrderStatus);
router.delete("/:orderId", authMiddleware(["admin"]), deleteOrder);

module.exports = router;
