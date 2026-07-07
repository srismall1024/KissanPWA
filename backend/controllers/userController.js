const pool = require("../config/db");

const updatePaymentDetails = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            bank_name,
            account_number,
            ifsc_code,
            upi_id
        } = req.body;

        const result = await pool.query(
            `
            UPDATE users
            SET
                bank_name = $1,
                account_number = $2,
                ifsc_code = $3,
                upi_id = $4
            WHERE user_id = $5
            RETURNING *
            `,
            [
                bank_name,
                account_number,
                ifsc_code,
                upi_id,
                user_id
            ]
        );

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

module.exports = {
    updatePaymentDetails
};