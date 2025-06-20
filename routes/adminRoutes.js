const express = require("express");
const adminControllers = require("../controllers/adminControllers");
const router = express.Router();
const { verifySupabaseToken } = require("../middlewares/authMiddlewares");

router.get("/dashboard", verifySupabaseToken, adminControllers.getDashboard);
router.get("/display", verifySupabaseToken, adminControllers.getDisplay);
router.post("/add-customer", verifySupabaseToken, adminControllers.addCustomer);
router.put(
  "/edit-customer/:id",
  verifySupabaseToken,
  adminControllers.updateCustomer
);

router.delete(
  "/delete-customer/:id",
  verifySupabaseToken,
  adminControllers.deleteCustomer
);

router.get(
  "/customer-count-by-province",
  verifySupabaseToken,
  adminControllers.getCustomerCountByProvince
);

module.exports = router;
