const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint
} = require("../controllers/complaintController");

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("buyer"),
    createComplaint
);

router.get("/", getAllComplaints);

router.get("/:id", getComplaintById);

router.put("/:id/status", updateComplaintStatus);

router.delete("/:id", deleteComplaint);

module.exports = router;