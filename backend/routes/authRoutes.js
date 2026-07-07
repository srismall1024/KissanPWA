const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    register,
    login,
    getProfile,
    updateProfile
} = require("../controllers/authController");

// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Routes Working"
    });
});

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/update-profile",
    authMiddleware,
    updateProfile
);

// Register
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;