const pool = require("../config/db");

// Create Complaint
const createComplaint = async (req, res) => {
    try {
        const buyer_id = req.user.user_id;

        const {
            order_id,
            complaint_text
        } = req.body;

        const orderResult = await pool.query(
    `SELECT status
     FROM orders
     WHERE order_id = $1`,
    [order_id]
);

if (
    orderResult.rows.length === 0
) {
    return res.status(404).json({
        success: false,
        message: "Order not found"
    });
}

if (
    orderResult.rows[0].status !== "Delivered"
) {
    return res.status(400).json({
        success: false,
        message:
            "Complaint can be raised only after delivery"
    });
}

        const complaint = await pool.query(
            `INSERT INTO complaints
            (buyer_id, order_id, complaint_text)
            VALUES ($1,$2,$3)
            RETURNING *`,
            [buyer_id, order_id, complaint_text]
        );

        res.status(201).json({
            success: true,
            complaint: complaint.rows[0]
        });

    } catch (err) {
        console.error("CREATE COMPLAINT ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get All Complaints
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await pool.query(
            `SELECT
                c.*,
                u.full_name,
                u.email,
                u.phone
            FROM complaints c
            JOIN users u
                ON c.buyer_id = u.user_id
            ORDER BY c.complaint_id DESC`
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

// Get Complaint By ID
const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await pool.query(
            "SELECT * FROM complaints WHERE complaint_id = $1",
            [id]
        );

        if (complaint.rows.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            complaint: complaint.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedComplaint = await pool.query(
            `UPDATE complaints
             SET status = $1
             WHERE complaint_id = $2
             RETURNING *`,
            [status, id]
        );

        res.json({
            success: true,
            complaint: updatedComplaint.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM complaints WHERE complaint_id = $1",
            [id]
        );

        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
};

module.exports = {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint
};