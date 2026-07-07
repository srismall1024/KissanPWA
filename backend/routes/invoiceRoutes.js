const express =
    require("express");

const router =
    express.Router();

const {
    getBuyerInvoices,
    getFarmerInvoices,
    getOperatorInvoices
} = require(
    "../controllers/invoiceController"
);

const auth =
    require("../middleware/authMiddleware");

router.get(
    "/buyer",
    auth,
    getBuyerInvoices
);

router.get(
    "/farmer",
    auth,
    getFarmerInvoices
);

router.get(
    "/operator",
    auth,
    getOperatorInvoices
);

module.exports = router;