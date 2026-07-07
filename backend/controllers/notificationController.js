const pool = require("../config/db");

const getNotifications = async (req, res) => {

    try {

        const user_id =
            req.user.user_id;

        const notifications =
            await pool.query(
                `
                SELECT *
                FROM notifications
                WHERE user_id = $1
                ORDER BY created_at DESC
                `,
                [user_id]
            );

        res.json({

            success: true,

            notifications:
                notifications.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false

        });

    }

};

module.exports = {
    getNotifications
};