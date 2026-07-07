const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// DB Connection
const pool = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./routes/cropRoutes");
const orderRoutes = require("./routes/orderRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes =
require("./routes/aiRoutes");
const wishlistRoutes =
require("./routes/wishlistRoutes");
const dashboardRoutes =require("./routes/dashboardRoutes");
const cartRoutes =
require("./routes/cartRoutes");
const chatbotRoutes =
require("./routes/chatbotRoutes");
const notificationRoutes =
require("./routes/notificationRoutes");
const paymentRoutes =
require("./routes/paymentRoutes");
const invoiceRoutes =
    require("./routes/invoiceRoutes");
const userRoutes =
    require("./routes/userRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static("uploads")
);

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use(
    "/api/ai",
    aiRoutes
);
app.use(
    "/api/wishlist",
    wishlistRoutes
);
app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use(
    "/api/cart",
    cartRoutes
);
app.use(
    "/api/chatbot",
    chatbotRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);
app.use(
    "/api/payments",
    paymentRoutes
);
app.use(
    "/api/invoices",
    invoiceRoutes
);
app.use(
    "/api/users",
    userRoutes
);

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "🚀 KisanPWA Backend is Running"
    });
});

// DB Test Route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            time: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});