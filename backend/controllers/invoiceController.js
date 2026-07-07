const pool = require("../config/db");

const getBuyerInvoices = async (req, res) => {

    try {

        const buyer_id =
            req.user.user_id;

        const invoices =
await pool.query(

`
SELECT

i.*,

c.crop_name,
c.price_per_kg,
c.location AS farmer_location,

buyer.full_name AS buyer_name,
buyer.email AS buyer_email,
buyer.phone AS buyer_phone,
buyer.address AS buyer_address,
buyer.district AS buyer_district,
buyer.state AS buyer_state,
buyer.pincode AS buyer_pincode,

farmer.full_name AS farmer_name,
farmer.email AS farmer_email,
farmer.phone AS farmer_phone,
farmer.address AS farmer_address,
farmer.district AS farmer_district,
farmer.state AS farmer_state,
farmer.pincode AS farmer_pincode,

farmer.bank_name,
farmer.account_number,
farmer.ifsc_code,
farmer.upi_id,

(
    SELECT email
    FROM users
    WHERE role = 'operator'
    ORDER BY RANDOM()
    LIMIT 1
) AS operator_email

FROM invoices i

JOIN crops c
ON i.crop_id = c.crop_id

JOIN users buyer
ON i.buyer_id = buyer.user_id

JOIN users farmer
ON i.farmer_id = farmer.user_id

WHERE i.buyer_id = $1

ORDER BY i.invoice_id DESC
`,

[buyer_id]

);

        res.json({

            success: true,

            invoices:
                invoices.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getFarmerInvoices = async (req, res) => {

    try {

        const farmer_id = req.user.user_id;

        const invoices = await pool.query(

`
SELECT

i.*,

c.crop_name,
c.price_per_kg,

buyer.full_name AS buyer_name,
buyer.email AS buyer_email,
buyer.phone AS buyer_phone,
buyer.address AS buyer_address,
buyer.district AS buyer_district,
buyer.state AS buyer_state,
buyer.pincode AS buyer_pincode,

farmer.full_name AS farmer_name,
farmer.email AS farmer_email,
farmer.phone AS farmer_phone,
farmer.address AS farmer_address,
farmer.district AS farmer_district,
farmer.state AS farmer_state,
farmer.pincode AS farmer_pincode,
farmer.bank_name,
farmer.account_number,
farmer.ifsc_code,
farmer.upi_id

FROM invoices i

JOIN crops c
ON i.crop_id = c.crop_id

JOIN users buyer
ON i.buyer_id = buyer.user_id

JOIN users farmer
ON i.farmer_id = farmer.user_id

WHERE i.farmer_id = $1

ORDER BY i.invoice_id DESC
`,

[farmer_id]

);

        res.json({

            success: true,

            invoices: invoices.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

const getOperatorInvoices = async (req, res) => {

    try {

        const invoices = await pool.query(

`
SELECT

i.*,

c.crop_name,
c.price_per_kg,

buyer.full_name AS buyer_name,
buyer.email AS buyer_email,
buyer.phone AS buyer_phone,
buyer.address AS buyer_address,
buyer.district AS buyer_district,
buyer.state AS buyer_state,
buyer.pincode AS buyer_pincode,

farmer.full_name AS farmer_name,
farmer.email AS farmer_email,
farmer.phone AS farmer_phone,
farmer.address AS farmer_address,
farmer.district AS farmer_district,
farmer.state AS farmer_state,
farmer.pincode AS farmer_pincode,

farmer.bank_name,
farmer.account_number,
farmer.ifsc_code,
farmer.upi_id

FROM invoices i

JOIN crops c
ON i.crop_id = c.crop_id

JOIN users buyer
ON i.buyer_id = buyer.user_id

JOIN users farmer
ON i.farmer_id = farmer.user_id

ORDER BY i.invoice_id DESC
`
        );

        res.json({
            success: true,
            invoices: invoices.rows
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false
        });

    }
};

module.exports = {
    getBuyerInvoices,
    getFarmerInvoices,
    getOperatorInvoices
};