const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const { createTicket, getTicketsByCustomer } = require("../services/Ticket");
const User = require("../models/user.model");

describe("Tenant Data Isolation Tests", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("Admin from Tenant A cannot access Tenant B data", async () => {
    const user1 = await User.create({
      email: "user1@logistics.com",
      password: "hashedpassword1",
      role: "admin",
      customerId: "LogisticsCo",
    });

    const user2 = await User.create({
      email: "user2@retail.com",
      password: "hashedpassword2",
      role: "admin",
      customerId: "RetailGmbH",
    });

    await createTicket({
      title: "Test A",
      customerId: "LogisticsCo",
      createdBy: user1._id,
    });

    await createTicket({
      title: "Test B",
      customerId: "RetailGmbH",
      createdBy: user2._id,
    });

    const ticketsA = await getTicketsByCustomer("LogisticsCo");
    const ticketsB = await getTicketsByCustomer("RetailGmbH");

    expect(ticketsA.length).toBe(1);
    expect(ticketsA[0].customerId).toBe("LogisticsCo");
    expect(ticketsB.length).toBe(1);
    expect(ticketsB[0].customerId).toBe("RetailGmbH");
  });
});
