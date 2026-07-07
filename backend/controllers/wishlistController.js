const pool = require("../config/db");

// Add to wishlist
const addToWishlist = async (req, res) => {

    try {

        const buyer_id = req.user.user_id;
        const { crop_id } = req.body;

        const existing =
            await pool.query(
                `
                SELECT *
                FROM wishlist
                WHERE buyer_id = $1
                AND crop_id = $2
                `,
                [buyer_id, crop_id]
            );

        if (existing.rows.length > 0) {

            return res.json({
                success: false,
                message: "Already Added"
            });

        }

        const item =
            await pool.query(
                `
                INSERT INTO wishlist
                (
                    buyer_id,
                    crop_id
                )
                VALUES ($1,$2)
                RETURNING *
                `,
                [buyer_id, crop_id]
            );

        res.json({
            success: true,
            item: item.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Get wishlist
const getWishlist = async (req, res) => {

    try {

        const buyer_id =
            req.user.user_id;

        const items =
            await pool.query(
                `
                SELECT
                    w.*,
                    c.crop_name,
                    c.price_per_kg,
                    c.quantity_kg,
                    c.image_url
                FROM wishlist w
                JOIN crops c
                ON w.crop_id = c.crop_id
                WHERE w.buyer_id = $1
                ORDER BY w.wishlist_id DESC
                `,
                [buyer_id]
            );

        res.json({
            success: true,
            items: items.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

// Remove wishlist
const removeWishlist = async (req, res) => {

    try {

        const { id } =
            req.params;

        await pool.query(
            `
            DELETE FROM wishlist
            WHERE wishlist_id = $1
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

module.exports = {
    addToWishlist,
    getWishlist,
    removeWishlist
};