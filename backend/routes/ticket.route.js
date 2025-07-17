const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  create,
  list,
  updateStatus,
} = require("../controllers/ticketController");
const { updateTicketStatus } = require("../services/Ticket");

const router = express.Router();

router.post("/ticket-done", async (req, res) => {
  const secret = req.headers["x-wehbook-secret"];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(403).json({ message: "Invalid webhook secret" });
  }

  const { ticketId, customerId, status } = req.body;
  if (!ticketId || !customerId || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const ticket = await updateTicketStatus(ticketId, status, customerId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  req.io.emit("ticketUpdated", ticket);
  res.json({ message: "Ticket status updated successfully", ticket });
});

router.use(protect);

router.post("/", create);
router.get("/", list);
router.patch("/:id/status", updateStatus);

module.exports = router;
