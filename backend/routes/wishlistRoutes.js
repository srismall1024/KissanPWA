const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
    addToWishlist,
    getWishlist,
    removeWishlist
} = require("../controllers/wishlistController");

router.post(
    "/add",
    authMiddleware,
    roleMiddleware("buyer"),
    addToWishlist
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    getWishlist
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("buyer"),
    removeWishlist
);

module.exports = router;