const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const User = require("../models/user.model");
const AuditLog = require("../models/auditLog.model");

const router = express.Router();

router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find({ customerId: req.user.customerId });
  res.json({ users });
});

router.get("/audit-logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await AuditLog.find({ customerId: req.user.customerId }).sort({
      timestamp: -1,
    });
    res.json({ logs });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
