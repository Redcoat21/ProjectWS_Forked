// app/controllers/authController.js
const authService = require("../services/AuthService");

const register = async function (req, res) {
  const { error } = authService.validateRegistration(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { name, username, email, password } = req.body;
    await authService.register(name, username, email, password);
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};

const login = async function (req, res) {
  const { error } = authService.validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};

module.exports = {
  register,
  login,
};
