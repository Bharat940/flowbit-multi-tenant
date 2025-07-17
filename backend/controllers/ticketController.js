const axios = require("axios");
const {
  createTicket,
  getTicketsByCustomer,
  getTicketsByCustomerId,
  updateTicketStatus,
} = require("../services/Ticket");

const { logAudit } = require("../services/Audit"); // ✅ Add this line

const create = async (req, res) => {
  const { title, description } = req.body;
  const { customerId, id: userId } = req.user;

  try {
    const ticket = await createTicket({
      title,
      description,
      customerId,
      createdBy: userId,
    });

    // ✅ Log audit
    await logAudit("CREATE_TICKET", userId, customerId);

    const N8N_BASE_URL = "http://n8n:5678";

    await axios.post(
      `${N8N_BASE_URL}/webhook/ticket-created`,
      {
        ticketId: ticket._id,
        customerId,
      },
      { headers: { "x-webhook-secret": process.env.WEBHOOK_SECRET } }
    );

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("❌ Ticket Creation Failed:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    res.status(500).json({ message: error.message });
  }
};

const list = async (req, res) => {
  const { customerId } = req.user;

  try {
    const tickets = await getTicketsByCustomer(customerId);

    res.status(200).json({
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { customerId, id: userId } = req.user;

  try {
    const updatedTicket = await updateTicketStatus(id, status, customerId);

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or access denied" });
    }

    // ✅ Log audit
    await logAudit("UPDATE_TICKET_STATUS", userId, customerId);

    res.status(200).json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create, list, updateStatus };
