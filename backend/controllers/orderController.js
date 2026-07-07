const pool = require("../config/db");



// Create Order
const createOrder = async (req, res) => {

    
    try {

        const buyer_id = req.user.user_id;

        const {
    crop_id,
    quantity_kg,
    total_amount,

    payment_method,
    payment_status,

    paid_amount,
    pending_amount
} = req.body;

        const cropResult = await pool.query(
            `SELECT quantity_kg
             FROM crops
             WHERE crop_id = $1`,
            [crop_id]
        );

        if (cropResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        const availableQty = Number(cropResult.rows[0].quantity_kg);

        if (availableQty < Number(quantity_kg)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        const invoiceNumber =
    `INV-${Date.now()}`;

        const order = await pool.query(
    `INSERT INTO orders
(
    buyer_id,
    crop_id,
    quantity_kg,
    total_amount,

    payment_method,
    payment_status,

    paid_amount,
    pending_amount,

    invoice_number
)
VALUES
(
    $1,$2,$3,$4,
    $5,$6,
    $7,$8,
    $9
)
RETURNING *`,
    [
        buyer_id,
        crop_id,
        quantity_kg,
        total_amount,
        payment_method,
        payment_status,
        paid_amount,
        pending_amount,
        invoiceNumber
    ]
);

await pool.query(
    `UPDATE crops
     SET quantity_kg = quantity_kg - $1
     WHERE crop_id = $2`,
    [quantity_kg, crop_id]
);

const cropDetails =
    await pool.query(

        `
        SELECT
            farmer_id
        FROM crops
        WHERE crop_id = $1
        `,

        [crop_id]
    );

const farmer_id =
    cropDetails.rows[0].farmer_id;
    
await pool.query(

`
INSERT INTO invoices
(
    invoice_number,
    order_id,

    buyer_id,
    farmer_id,
    crop_id,

    quantity_kg,

    total_amount,
    paid_amount,
    pending_amount,

    payment_mode,
    payment_status
)
VALUES
(
    $1,$2,$3,$4,$5,
    $6,$7,$8,$9,
    $10,$11
)
`,

[
    invoiceNumber,

    order.rows[0].order_id,

    buyer_id,
    farmer_id,
    crop_id,

    quantity_kg,

    total_amount,

    paid_amount,
    pending_amount,

    payment_method,

    payment_status
]

);

        const cropInfo = await pool.query(
    `
    SELECT
        crop_name,
        quantity_kg,
        farmer_id
    FROM crops
    WHERE crop_id = $1
    `,
    [crop_id]
);

console.log(
    "LOW STOCK NOTIFICATION TRIGGERED"
);

if (cropInfo.rows[0].quantity_kg < 20) {

    await pool.query(
        `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        `,
        [
            cropInfo.rows[0].farmer_id,
            "Low Stock Alert",
            `${cropInfo.rows[0].crop_name} stock is below 20 kg`
        ]
    );

    console.log("NOTIFICATION SAVED");

}

        res.status(201).json({
            success: true,
            order: order.rows[0]
        });

    } catch (err) {
        console.error("CREATE ORDER ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            "SELECT * FROM orders ORDER BY order_id DESC"
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


// Get Order By ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await pool.query(
            "SELECT * FROM orders WHERE order_id = $1",
            [id]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order: order.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const orderResult =
            await pool.query(
                `SELECT *
                 FROM orders
                 WHERE order_id = $1`,
                [id]
            );

        if (orderResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const order =
            orderResult.rows[0];

        const updatedOrder =
            await pool.query(
                `UPDATE orders
                 SET status = $1
                 WHERE order_id = $2
                 RETURNING *`,
                [status, id]
            );


        res.json({

            success: true,

            order:
                updatedOrder.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false

        });

    }

};

// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM orders WHERE order_id = $1",
            [id]
        );

        res.json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

const getFarmerOrders = async (req, res) => {

    try {

        const farmer_id =
            req.user.user_id;

        const orders =
await pool.query(
`
SELECT
    o.*,
    c.crop_name,
    i.invoice_number,
    i.payment_status
FROM orders o

JOIN crops c
ON o.crop_id = c.crop_id

JOIN invoices i
ON o.order_id = i.order_id

WHERE c.farmer_id = $1

ORDER BY o.order_id DESC
`,
[farmer_id]
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

const cancelOrder = async (req, res) => {


try {

    const { id } = req.params;

    const orderResult =
        await pool.query(
            `SELECT *
             FROM orders
             WHERE order_id = $1`,
            [id]
        );

    if (orderResult.rows.length === 0) {

        return res.status(404).json({
            success: false,
            message: "Order not found"
        });

    }

    const order =
        orderResult.rows[0];

    if (order.status === "Cancelled") {

        return res.status(400).json({
            success: false,
            message: "Order already cancelled"
        });

    }

    await pool.query(
        `UPDATE crops
         SET quantity_kg =
             quantity_kg + $1
         WHERE crop_id = $2`,
        [
            order.quantity_kg,
            order.crop_id
        ]
    );

    const cancelledOrder =
        await pool.query(
            `UPDATE orders
             SET status = 'Cancelled'
             WHERE order_id = $1
             RETURNING *`,
            [id]
        );

    res.json({

        success: true,

        order:
            cancelledOrder.rows[0]

    });

} catch (err) {

    console.error(err);

    res.status(500).json({

        success: false

    });

}


};

const getBuyerPaidOrders = async (req, res) => {

    try {

        const buyer_id = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                o.*,
                i.invoice_number,
                i.payment_status,
                i.payment_mode
            FROM orders o

            JOIN invoices i
            ON o.order_id = i.order_id

            WHERE o.buyer_id = $1

            ORDER BY o.order_id DESC
            `,
            [buyer_id]
        );

        res.json({
            success: true,
            orders: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getFarmerOrders,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    getBuyerPaidOrders
};