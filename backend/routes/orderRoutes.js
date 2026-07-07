const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    getFarmerOrders,
    getBuyerPaidOrders
} = require("../controllers/orderController");

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("buyer"),
    createOrder
);

router.get("/", getAllOrders);

router.get(
    "/farmer/orders",
    authMiddleware,
    roleMiddleware("farmer"),
    getFarmerOrders
);

router.get(
    "/buyer-paid-orders",
    authMiddleware,
    roleMiddleware("buyer"),
    getBuyerPaidOrders
);

router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

router.put(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("buyer"),
    cancelOrder
);

router.delete("/:id", deleteOrder);

module.exports = router;