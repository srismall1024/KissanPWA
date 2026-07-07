const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
    addToCart,
    getCart,
    removeCartItem,
    updateCartQuantity,
    checkoutCart
} = require("../controllers/cartController");

router.post(
    "/add",
    authMiddleware,
    roleMiddleware("buyer"),
    addToCart
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    getCart
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("buyer"),
    removeCartItem
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("buyer"),
    updateCartQuantity
);

router.post(
    "/checkout",
    authMiddleware,
    roleMiddleware("buyer"),
    checkoutCart
);

module.exports = router;