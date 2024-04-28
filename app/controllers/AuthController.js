const authService = require("../services/AuthService");

const register = async function (req, res) {
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
