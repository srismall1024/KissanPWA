const pool = require("../config/db");

// Add To Cart
const addToCart = async (req, res) => {

    try {

        const buyer_id = req.user.user_id;

        const {
            crop_id,
            quantity_kg
        } = req.body;

        // CHECK STOCK
        const crop =
            await pool.query(
                `
                SELECT quantity_kg
                FROM crops
                WHERE crop_id = $1
                `,
                [crop_id]
            );

        if (crop.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });

        }

        const availableStock =
            Number(
                crop.rows[0].quantity_kg
            );

        if (
            Number(quantity_kg) >
            availableStock
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Only ${availableStock} kg available`

            });

        }

        // INSERT INTO CART
        const cartItem =
            await pool.query(
                `
                INSERT INTO cart
                (
                    buyer_id,
                    crop_id,
                    quantity_kg
                )
                VALUES ($1,$2,$3)
                RETURNING *
                `,
                [
                    buyer_id,
                    crop_id,
                    quantity_kg
                ]
            );

        res.json({
            success: true,
            item: cartItem.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Get Cart
const getCart = async (req, res) => {

    try {

        const buyer_id =
            req.user.user_id;

        const cart =
            await pool.query(
                `
                SELECT
                    cart.*,
                    crops.crop_name,
                    crops.price_per_kg,
                    crops.image_url,
                    crops.quantity_kg AS available_stock
                FROM cart
                JOIN crops
                ON cart.crop_id = crops.crop_id
                WHERE cart.buyer_id = $1
                ORDER BY cart_id DESC
                `,
                [buyer_id]
            );

        res.json({
            success: true,
            cart: cart.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Remove Cart Item
const removeCartItem = async (req, res) => {

    try {

        const { id } =
            req.params;

        await pool.query(
            `
            DELETE FROM cart
            WHERE cart_id = $1
            `,
            [id]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Checkout Cart
// Checkout Cart
const checkoutCart = async (req, res) => {

    try {

        const buyer_id =
            req.user.user_id;

        const cartItems =
            await pool.query(
                `
                SELECT
                    cart.*,
                    crops.price_per_kg,
                    crops.quantity_kg AS available_stock
                FROM cart
                JOIN crops
                ON cart.crop_id = crops.crop_id
                WHERE cart.buyer_id = $1
                `,
                [buyer_id]
            );

        if (
            cartItems.rows.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });

        }

        // STOCK VALIDATION
        for (const item of cartItems.rows) {

            if (
                Number(item.quantity_kg) >
                Number(item.available_stock)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `${item.crop_name} has only ${item.available_stock} kg available`

                });

            }

        }

        // CREATE ORDERS + REDUCE STOCK
        for (const item of cartItems.rows) {

            const total_amount =
                Number(item.quantity_kg) *
                Number(item.price_per_kg);

            await pool.query(
                `
                INSERT INTO orders
                (
                    buyer_id,
                    crop_id,
                    quantity_kg,
                    total_amount
                )
                VALUES ($1,$2,$3,$4)
                `,
                [
                    buyer_id,
                    item.crop_id,
                    item.quantity_kg,
                    total_amount
                ]
            );

            await pool.query(
                `
                UPDATE crops
                SET quantity_kg =
                    quantity_kg - $1
                WHERE crop_id = $2
                `,
                [
                    item.quantity_kg,
                    item.crop_id
                ]
            );
        }

        await pool.query(
            `
            DELETE FROM cart
            WHERE buyer_id = $1
            `,
            [buyer_id]
        );

        res.json({

            success: true,

            message:
                "Checkout completed"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Update Cart Quantity
const updateCartQuantity = async (req, res) => {

    try {

        const { id } = req.params;

        const { quantity_kg } = req.body;

        if (quantity_kg <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be greater than 0"

            });

        }

        const cartItem =
    await pool.query(
        `
        SELECT
            cart.*,
            crops.quantity_kg AS available_stock
        FROM cart
        JOIN crops
        ON cart.crop_id = crops.crop_id
        WHERE cart_id = $1
        `,
        [id]
    );

if (
    cartItem.rows.length === 0
) {

    return res.status(404).json({

        success: false,

        message:
            "Cart item not found"

    });

}

if (
    Number(quantity_kg) >
    Number(
        cartItem.rows[0]
        .available_stock
    )
) {

    return res.status(400).json({

        success: false,

        message:
            `Only ${cartItem.rows[0].available_stock} kg available`

    });

}

        const updated =
            await pool.query(
                `
                UPDATE cart
                SET quantity_kg = $1
                WHERE cart_id = $2
                RETURNING *
                `,
                [
                    quantity_kg,
                    id
                ]
            );

        res.json({

            success: true,

            item:
                updated.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false

        });

    }
};

module.exports = {
    addToCart,
    getCart,
    removeCartItem,
    updateCartQuantity,
    checkoutCart
};