const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    updatePaymentDetails
} = require("../controllers/userController");

router.put(
    "/payment-details",
    authMiddleware,
    updatePaymentDetails
);

module.exports = router;