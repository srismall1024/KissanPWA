const pool = require("../config/db");

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT user_id, full_name, email, phone, role
             FROM users
             ORDER BY user_id DESC`
        );

        res.json({
            success: true,
            users: users.rows
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Get All Crops
const getCrops = async (req, res) => {
    try {
        const crops = await pool.query(
            "SELECT * FROM crops ORDER BY crop_id DESC"
        );

        res.json({
            success: true,
            crops: crops.rows
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT
    o.*,
    i.invoice_number,
    i.payment_mode,
    i.payment_status
FROM orders o
INNER JOIN invoices i
    ON o.order_id = i.order_id
WHERE i.payment_status IN ('Paid','Partial')
ORDER BY o.order_id DESC;`
        );

        res.json({
            success: true,
            orders: orders.rows
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Get All Complaints
const getComplaints = async (req, res) => {
    try {
        const complaints = await pool.query(
            "SELECT * FROM complaints ORDER BY complaint_id DESC"
        );

        res.json({
            success: true,
            complaints: complaints.rows
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

const getDashboardStats = async (req, res) => {

    try {

        const totalRevenue =
            await pool.query(
                `
                SELECT
COALESCE(
    SUM(paid_amount),
    0
) AS revenue
FROM invoices
                `
            );

        const totalOnline =
            await pool.query(
                `
                SELECT
                COALESCE(
                    SUM(paid_amount),
                    0
                ) AS online
                FROM invoices
                WHERE payment_mode != 'cod'
                `
            );

        const codPending =
            await pool.query(
                `
                SELECT
                COALESCE(
                    SUM(pending_amount),
                    0
                ) AS pending
                FROM invoices
                `
            );

        const totalOrders =
    await pool.query(`
    SELECT COUNT(*) AS total_orders
    FROM invoices
    WHERE payment_status IN (
        'Paid',
        'Partial'
    )
`);

        res.json({

            success: true,

            stats: {

                totalRevenue:
                    totalRevenue.rows[0].revenue,

                totalOnline:
                    totalOnline.rows[0].online,

                codPending:
                    codPending.rows[0].pending,

                totalOrders:
                    totalOrders.rows[0].total_orders

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getTopSellingCrops = async (req, res) => {

    try {

        const result =
            await pool.query(

                `
                SELECT

                    c.crop_name,

                    SUM(
                        i.quantity_kg
                    ) AS total_sold

                FROM invoices i

                JOIN crops c
                ON i.crop_id = c.crop_id

                GROUP BY c.crop_name

                ORDER BY total_sold DESC

                LIMIT 5
                `
            );

        res.json({

            success: true,

            crops:
                result.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getTopFarmers = async (req, res) => {

    try {

        const result =
            await pool.query(

                `
                SELECT

                    u.full_name,

                    SUM(
                        i.paid_amount
                    ) AS revenue

                FROM invoices i

                JOIN users u
                ON i.farmer_id = u.user_id

                GROUP BY u.full_name

                ORDER BY revenue DESC

                LIMIT 5
                `
            );

        res.json({

            success: true,

            farmers:
                result.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getRevenueTrend = async (req, res) => {

    try {

        const result =
            await pool.query(

                `
                SELECT

                    DATE(invoice_date)
                    AS day,

                    SUM(paid_amount)
                    AS revenue

                FROM invoices

                GROUP BY day

                ORDER BY day
                `
            );

        res.json({

            success: true,

            trend:
                result.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getMonthlySales = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                TO_CHAR(
                    invoice_date,
                    'Mon YYYY'
                ) AS month,

                SUM(
                    paid_amount
                ) AS revenue

            FROM invoices

            GROUP BY month

            ORDER BY MIN(invoice_date)
            `
        );

        res.json({

            success: true,

            sales:
                result.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getKpiMetrics = async (req, res) => {

    try {

        const currentRevenue =
            await pool.query(`
                SELECT COALESCE(
                    SUM(paid_amount),
                    0
                ) AS revenue
                FROM invoices
            `);

        const currentOrders =
    await pool.query(`
    SELECT COUNT(*) AS total_orders
    FROM invoices
    WHERE payment_status IN (
        'Paid',
        'Partial'
    )
`);

        const currentPending =
            await pool.query(`
                SELECT COALESCE(
                    SUM(pending_amount),
                    0
                ) AS pending
                FROM invoices
            `);

        res.json({

            success: true,

            metrics: {

                revenue:
                    currentRevenue.rows[0].revenue,

                orders:
                    currentOrders.rows[0].total_orders,

                pending:
                    currentPending.rows[0].pending

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getCategoryRevenue = async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                c.category,

                SUM(i.paid_amount) AS revenue

            FROM invoices i

            JOIN crops c
            ON i.crop_id = c.crop_id

            GROUP BY c.category

            ORDER BY revenue DESC

        `);

        res.json({
            success: true,
            categories: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getTopBuyers = async (req, res) => {

    try {

        const result =
            await pool.query(

                `
                SELECT

                    u.full_name,

                    SUM(i.paid_amount)
                    AS spending

                FROM invoices i

                JOIN users u
                ON i.buyer_id = u.user_id

                GROUP BY u.full_name

                ORDER BY spending DESC

                LIMIT 5
                `
            );

        res.json({

            success: true,

            buyers:
                result.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

module.exports = {
    getUsers,
    getCrops,
    getOrders,
    getMonthlySales,
    getComplaints,
    getDashboardStats,
    getTopSellingCrops,
    getTopFarmers,
    getRevenueTrend,
    getKpiMetrics,
    getCategoryRevenue,
    getTopBuyers
};
