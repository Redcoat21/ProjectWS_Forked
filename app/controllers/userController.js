const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async function (req, res) {
  const { name, username, email, password } = req.body;

  try {
    const userCount = await User.count();
    const user_id = `USR${String(userCount + 1).padStart(3, "0")}`;
    let api_key = Math.random().toString(36).slice(2, 10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      user_id,
      name,
      username,
      email,
      password: hashedPassword,
      balance: 100000,
      api_key: api_key,
      api_hit: 50,
      premium: false,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not register user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const authToken = req.header("x-auth-token");

  try {
    let user;
    if (authToken) {
      user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.api_key !== authToken) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const token = jwt.sign({ user_id: user.user_id }, "PROJECTWS", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not log in" });
  }
};

module.exports = { register, login };
