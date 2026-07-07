const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
    makePayment
} =
require("../controllers/paymentController");

router.post(
    "/pay",
    authMiddleware,
    roleMiddleware("buyer"),
    makePayment
);

module.exports = router;