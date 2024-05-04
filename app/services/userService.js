const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async ({ user_id, name, username, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      user_id,
      name,
      username,
      email,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const login = async ({ username, password }) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }
    const token = jwt.sign({ user_id: user.user_id }, "your_secret_key", {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { register, login };
