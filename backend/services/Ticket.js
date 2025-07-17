const Ticket = require("../models/ticket.model");

const createTicket = async ({ title, description, customerId, createdBy }) => {
  const ticket = new Ticket({ title, description, customerId, createdBy });

  try {
    const savedTicket = await ticket.save();
    return savedTicket;
  } catch (error) {
    throw new Error("Error creating ticket: " + error.message);
  }
};

const getTicketsByCustomerId = async (id, customerId) => {
  try {
    const tickets = await Ticket.find({ _id: id, customerId }).populate(
      "createdBy",
      "email role customerId"
    );
    return tickets;
  } catch (error) {
    throw new Error("Error fetching tickets: " + error.message);
  }
};

const updateTicketStatus = async (id, status, customerId) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      { _id: id, customerId },
      { $set: { status } },
      { new: true }
    );
    return updatedTicket;
  } catch (error) {
    throw new Error("Error updating ticket status: " + error.message);
  }
};

const getTicketsByCustomer = async (customerId) => {
  try {
    const tickets = await Ticket.find({ customerId });
    return tickets;
  } catch (error) {
    throw new Error("Error fetching tickets: " + error.message);
  }
};

module.exports = {
  createTicket,
  getTicketsByCustomerId,
  updateTicketStatus,
  getTicketsByCustomer,
};
