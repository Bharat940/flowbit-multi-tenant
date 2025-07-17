const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  action: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerId: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", auditSchema);
