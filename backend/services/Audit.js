const AuditLog = require("../models/auditLog.model");

const logAudit = async (action, userId, customerId) => {
  try {
    await AuditLog.create({
      action,
      userId,
      customerId,
    });
  } catch (error) {
    console.error("Error writing audit log:", error.message);
  }
};

module.exports = { logAudit };
