const pool = require("../config/db");

// Add Crop
const addCrop = async (req, res) => {
    try {

        const farmer_id = req.user.user_id;
        const {
    crop_name,
    category,
    quantity_kg,
    price_per_kg,
    description,
    location
} = req.body;

const image_url =
    req.file
        ? `/uploads/${req.file.filename}`
        : null;

        const crop = await pool.query(
            `INSERT INTO crops
            (
                farmer_id,
                crop_name,
                category,
                quantity_kg,
                price_per_kg,
                description,
                image_url,
                location
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                farmer_id,
                crop_name,
                category,
                quantity_kg,
                price_per_kg,
                description,
                image_url,
                location
            ]
        );

        res.status(201).json({
            success: true,
            crop: crop.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to add crop"
        });
    }
};

// Get All Crops
const getAllCrops = async (req, res) => {
    try {

        const crops = await pool.query(
            `SELECT *
             FROM crops
             WHERE quantity_kg > 0
             ORDER BY crop_id DESC`
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

const getMyCrops = async (req, res) => {

    try {

        const farmer_id =
            req.user.user_id;

        const crops =
            await pool.query(
                `
                SELECT *
                FROM crops
                WHERE farmer_id = $1
                ORDER BY crop_id DESC
                `,
                [farmer_id]
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

// Get Single Crop
const getCropById = async (req, res) => {
    try {
        const { id } = req.params;

        const crop = await pool.query(
            "SELECT * FROM crops WHERE crop_id = $1",
            [id]
        );

        if (crop.rows.length === 0) {
            return res.status(404).json({
                message: "Crop not found"
            });
        }

        res.json({
            success: true,
            crop: crop.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false
        });
    }
};

// Delete Crop
const deleteCrop = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM crops
            WHERE crop_id = $1
            AND farmer_id = $2
            RETURNING *
            `,
            [
                id,
                req.user.user_id
            ]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });

        }

        res.json({
            success: true,
            message: "Crop deleted successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const updateCrop = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            crop_name,
            category,
            quantity_kg,
            price_per_kg,
            description,
            location
        } = req.body;

        const image_url =
            req.file
                ? `/uploads/${req.file.filename}`
                : null;

        let query;
        let values;

        if (image_url) {

            query = `
                UPDATE crops
                SET
                    crop_name = $1,
                    category = $2,
                    quantity_kg = $3,
                    price_per_kg = $4,
                    description = $5,
                    location = $6,
                    image_url = $7
                WHERE crop_id = $8
AND farmer_id = $9
                RETURNING *
            `;

            values = [
    crop_name,
    category,
    quantity_kg,
    price_per_kg,
    description,
    location,
    image_url,
    id,
    req.user.user_id
];

        } else {

            query = `
                UPDATE crops
                SET
                    crop_name = $1,
                    category = $2,
                    quantity_kg = $3,
                    price_per_kg = $4,
                    description = $5,
                    location = $6
                WHERE crop_id = $7
                AND farmer_id = $8
                RETURNING *
            `;

            values = [
    crop_name,
    category,
    quantity_kg,
    price_per_kg,
    description,
    location,
    id,
    req.user.user_id
];
        }

        const updatedCrop =
            await pool.query(query, values);

        res.json({
            success: true,
            crop: updatedCrop.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
};

module.exports = {
    addCrop,
    getAllCrops,
    getCropById,
    updateCrop,
    deleteCrop,
    getMyCrops
};