const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload =
require("../middleware/upload");

const {
    addCrop,
    getAllCrops,
    getMyCrops,
    getCropById,
    updateCrop,
    deleteCrop
} = require("../controllers/cropController");

router.post(
    "/add",
    authMiddleware,
    roleMiddleware("farmer"),
    upload.single("image"),
    addCrop
);

router.get("/", getAllCrops);

router.get("/my-crops",
    authMiddleware,
    roleMiddleware("farmer"),
    getMyCrops
);

router.get("/:id", getCropById);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("farmer"),
    upload.single("image"),
    updateCrop
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("farmer"),
    deleteCrop
);

module.exports = router;