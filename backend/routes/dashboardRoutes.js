const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
    getFarmerStats,
    getSalesHistory,
    getCropRevenueBreakdown,
    getRevenueOrdersTrend,
    getTopSellingCrops,
    getRevenueChart
} = require("../controllers/dashboardController");

router.get(
    "/farmer",
    authMiddleware,
    roleMiddleware("farmer"),
    getFarmerStats
);

router.get(
    "/sales-history",
    authMiddleware,
    roleMiddleware("farmer"),
    getSalesHistory
);

router.get(
    "/crop-revenue",
    authMiddleware,
    roleMiddleware("farmer"),
    getCropRevenueBreakdown
);

router.get(
    "/revenue-orders-trend",
    authMiddleware,
    roleMiddleware("farmer"),
    getRevenueOrdersTrend
);

router.get(
    "/top-selling-crops",
    authMiddleware,
    roleMiddleware("farmer"),
    getTopSellingCrops
);

router.get(
    "/revenue-chart",
    authMiddleware,
    roleMiddleware("farmer"),
    getRevenueChart
);

module.exports = router;