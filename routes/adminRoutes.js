const express = require("express");
const adminControllers = require("../controllers/adminControllers");
const router = express.Router();
const { verifySupabaseToken } = require("../middlewares/authMiddlewares");

router.get("/dashboard", verifySupabaseToken, adminControllers.getDashboard);
router.get("/display", verifySupabaseToken, adminControllers.getDisplay);

module.exports = router;
