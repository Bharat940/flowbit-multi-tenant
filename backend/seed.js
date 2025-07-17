const { createUser, getUserByEmail } = require("./services/User");

const seedData = async () => {
  const users = [
    {
      email: "admin@logisticsco.com",
      password: "password123",
      role: "admin",
      customerId: "LogisticsCo",
    },
    {
      email: "admin@retailgmbh.com",
      password: "password123",
      role: "admin",
      customerId: "RetailGmbH",
    },
  ];

  for (const user of users) {
    try {
      const existingUser = await getUserByEmail(user.email);
      if (!existingUser) {
        await createUser(user.email, user.password, user.role, user.customerId);
        console.log(`✅ User created: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }
};

module.exports = seedData;
