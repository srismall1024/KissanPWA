const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getUsers,
    getCrops,
    getOrders,
    getComplaints,
    getDashboardStats,
    getTopSellingCrops,
getTopFarmers,
getRevenueTrend,
getMonthlySales,
getKpiMetrics,
getCategoryRevenue,
getTopBuyers
} = require("../controllers/adminController");

// Admin-only protection
router.use(
    authMiddleware,
    roleMiddleware("operator")
);

router.get("/users", getUsers);

router.get("/crops", getCrops);

router.get("/orders", getOrders);

router.get("/complaints", getComplaints);

router.get(
    "/dashboard-stats",
    getDashboardStats
);

router.get(
    "/top-crops",
    getTopSellingCrops
);

router.get(
    "/top-farmers",
    getTopFarmers
);

router.get(
    "/revenue-trend",
    getRevenueTrend
);

router.get(
    "/monthly-sales",
    getMonthlySales
);

router.get(
    "/kpi-metrics",
    getKpiMetrics
);

router.get(
    "/category-revenue",
    getCategoryRevenue
);

router.get(
    "/top-buyers",
    getTopBuyers
);

module.exports = router;