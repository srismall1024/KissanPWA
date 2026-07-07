const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
const register = async (req, res) => {
    try {
        const {
    full_name,
    email,
    password,
    phone,
    role
} = req.body;

        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `INSERT INTO users
(
    full_name,
    email,
    password,
    phone,
    role
)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, full_name, email, phone, role`,
            [full_name, email, hashedPassword, phone, role]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.rows[0].user_id,
                role: user.rows[0].role
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {

    user_id:
        user.rows[0].user_id,

    full_name:
        user.rows[0].full_name,

    email:
        user.rows[0].email,

    phone:
        user.rows[0].phone,

    address:
        user.rows[0].address,

    district:
        user.rows[0].district,

    state:
        user.rows[0].state,

    pincode:
        user.rows[0].pincode,

    role:
        user.rows[0].role
}

        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const updateProfile =
async (req,res) => {

    try {

        const user_id =
            req.user.user_id;

        const {

            full_name,
            email,
            phone,
            address,
            district,
            state,
            pincode

        } = req.body;

        // Phone Validation
        if (
            phone &&
            !/^[0-9]{10}$/.test(phone)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Phone number must contain exactly 10 digits"
            });
        }

        // Pincode Validation
        if (
            pincode &&
            !/^[0-9]{6}$/.test(pincode)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Pincode must contain exactly 6 digits"
            });
        }

        const result =
            await pool.query(

                `
                UPDATE users
                SET

                    full_name = $1,
                    email = $2,
                    phone = $3,
                    address = $4,
                    district = $5,
                    state = $6,
                    pincode = $7

                WHERE user_id = $8

                RETURNING *
                `,

                [
                    full_name,
                    email,
                    phone,
                    address,
                    district,
                    state,
                    pincode,
                    user_id
                ]
            );

        res.json({

            success: true,

            user:
                result.rows[0]

        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false
        });
    }
};

const getProfile = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const result = await pool.query(

            `
            SELECT

                user_id,
                full_name,
                email,
                phone,
                address,
                district,
                state,
                pincode,
                role

            FROM users

            WHERE user_id = $1
            `,

            [user_id]

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
    register,
    login,
    updateProfile,
    getProfile
};