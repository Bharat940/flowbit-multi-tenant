const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const registry = require("../registry.json");

const router = express.Router();

router.get("/screens", protect, (req, res) => {
  const tenant = req.user.customerId;

  const tenantConfig = registry.tenants[tenant];
  if (!tenantConfig) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  const allowedScreens = tenantConfig.allowedScreens || [];
  const allScreens = registry.screens;

  const screens = allowedScreens.map((key) => ({
    key,
    ...allScreens[key],
  }));

  res.json({ screens });
});

module.exports = router;
