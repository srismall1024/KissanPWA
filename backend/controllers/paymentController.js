const pool = require("../config/db");

const makePayment = async (req, res) => {

    try {

        const buyer_id =
            req.user.user_id;

        const {
            crop_id,
            amount,
            card_number,
            card_name,
            cvv
        } = req.body;

        if (
            !card_number ||
            !card_name ||
            !cvv
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details required"
            });
        }

        const payment =
            await pool.query(
                `
                INSERT INTO payments
                (
                    buyer_id,
                    crop_id,
                    amount,
                    payment_status
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    'Success'
                )
                RETURNING *
                `,
                [
                    buyer_id,
                    crop_id,
                    amount
                ]
            );

        res.json({

            success: true,

            payment:
                payment.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

module.exports = {
    makePayment
};