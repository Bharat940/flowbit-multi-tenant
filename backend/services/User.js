const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const createUser = async (email, password, role, customerId) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role, customerId });

  try {
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing passwords: " + error.message);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  comparePassword,
};
