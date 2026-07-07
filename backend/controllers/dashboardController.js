const pool = require("../config/db");

const getFarmerStats = async (req, res) => {

    try {

        const farmer_id = req.user.user_id;

        const revenue = await pool.query(
    `
    SELECT COALESCE(
        SUM(i.paid_amount),
        0
    ) AS revenue
    FROM invoices i
    WHERE i.farmer_id = $1
    `,
    [farmer_id]
);

        const totalOrders = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM invoices i
    WHERE i.farmer_id = $1
    AND i.paid_amount > 0
    `,
    [farmer_id]
);

        const monthlyRevenue = await pool.query(
`
SELECT COALESCE(
    SUM(i.paid_amount),
    0
) AS revenue
FROM invoices i
WHERE i.farmer_id = $1
AND DATE_TRUNC(
    'month',
    i.invoice_date
) = DATE_TRUNC(
    'month',
    CURRENT_DATE
)
`,
[farmer_id]
);

const bestSellingCrop = await pool.query(
`
SELECT
    c.crop_name,
    SUM(i.quantity_kg) AS sold_qty,
    SUM(i.paid_amount) AS revenue
FROM invoices i
JOIN crops c
ON i.crop_id = c.crop_id
WHERE i.farmer_id = $1
GROUP BY c.crop_name
ORDER BY revenue DESC
LIMIT 1
`,
[farmer_id]
);

const lowStock = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM crops
    WHERE farmer_id = $1
    AND quantity_kg < 20
    `,
    [farmer_id]
);

const topBuyers = await pool.query(
`
SELECT
    u.full_name,
    COUNT(i.invoice_id) AS total_orders,
    SUM(i.paid_amount) AS total_spent
FROM invoices i
JOIN users u
ON i.buyer_id = u.user_id
WHERE i.farmer_id = $1
GROUP BY
    u.user_id,
    u.full_name
ORDER BY
    SUM(i.paid_amount) DESC
LIMIT 5
`,
[farmer_id]
);

console.log(
    "Revenue:",
    revenue.rows
);

console.log(
    "Orders:",
    totalOrders.rows
);

console.log(
    "Monthly Revenue:",
    monthlyRevenue.rows
);

console.log(
    "Best Crop:",
    bestSellingCrop.rows
);

console.log(
    "Low Stock:",
    lowStock.rows
);

console.log(
    "Top Buyers:",
    topBuyers.rows
);

        res.json({

    success: true,

    revenue:
        revenue.rows[0].revenue,

    totalOrders:
        totalOrders.rows[0].count,

    lowStock:
        lowStock.rows[0].count,

    monthlyRevenue:
        monthlyRevenue.rows[0].revenue,

    bestSellingCrop:
        bestSellingCrop.rows[0] || null,

    topBuyers:
        topBuyers.rows

});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success:false
        });

    }
};

const getRevenueChart = async (req, res) => {

    try {

        const farmer_id = req.user.user_id;

        const result = await pool.query(
`
SELECT
    DATE(i.invoice_date) AS day,
    SUM(i.paid_amount) AS revenue
FROM invoices i
WHERE i.farmer_id = $1
GROUP BY DATE(i.invoice_date)
ORDER BY day ASC
`,
[farmer_id]
);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

const getCropRevenueBreakdown = async (req, res) => {

    try {

        const farmer_id = req.user.user_id;

        const result = await pool.query(
`
SELECT
    c.crop_name,
    SUM(i.paid_amount) AS revenue,
    SUM(i.quantity_kg) AS sold_qty
FROM invoices i
JOIN crops c
ON i.crop_id = c.crop_id
WHERE i.farmer_id = $1
GROUP BY c.crop_name
ORDER BY revenue DESC
`,
[farmer_id]
);

        res.json({
            success: true,
            crops: result.rows
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

        const farmer_id =
            req.user.user_id;

        const result =
await pool.query(
`
SELECT
    c.crop_name,
    SUM(i.quantity_kg) AS sold_qty
FROM invoices i
JOIN crops c
ON i.crop_id = c.crop_id
WHERE i.farmer_id = $1
GROUP BY c.crop_name
ORDER BY sold_qty DESC
`,
[farmer_id]
);

        res.json({
            success: true,
            crops: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

const getSalesHistory = async (req, res) => {

    try {

        const farmer_id = req.user.user_id;

        const sales = await pool.query(
`
SELECT

    i.invoice_id,

    u.full_name AS buyer_name,

    c.crop_name,

    i.quantity_kg,

    i.total_amount,

    i.paid_amount,

    i.pending_amount,

    i.payment_status,

    i.invoice_date

FROM invoices i

JOIN crops c
ON i.crop_id = c.crop_id

JOIN users u
ON i.buyer_id = u.user_id

WHERE i.farmer_id = $1

ORDER BY i.invoice_date DESC
`,
[farmer_id]
);

        res.json({
            success: true,
            sales: sales.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

const getRevenueOrdersTrend = async (req, res) => {

    try {

        const farmer_id =
            req.user.user_id;

        const result =
await pool.query(
`
SELECT
    DATE(i.invoice_date) AS day,

    SUM(i.paid_amount) AS revenue,

    COUNT(i.invoice_id) AS orders

FROM invoices i

WHERE i.farmer_id = $1

GROUP BY
    DATE(i.invoice_date)

ORDER BY
    day ASC
`,
[farmer_id]
);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

module.exports = {
    getFarmerStats,
    getRevenueChart,
    getCropRevenueBreakdown,
    getRevenueOrdersTrend,
    getTopSellingCrops,
    getSalesHistory
};