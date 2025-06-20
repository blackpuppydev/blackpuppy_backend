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

router.get(
  "/display-next",
  verifySupabaseToken,
  adminControllers.getDisplayNext
);
router.post(
  "/add-customer-next",
  verifySupabaseToken,
  adminControllers.addCustomerNext
);
router.put(
  "/edit-customer-next/:id",
  verifySupabaseToken,
  adminControllers.updateCustomerNext
);

router.delete(
  "/delete-customer-next/:id",
  verifySupabaseToken,
  adminControllers.deleteCustomerNext
);

module.exports = router;
