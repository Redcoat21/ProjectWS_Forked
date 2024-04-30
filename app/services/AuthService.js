const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("joi");

const register = async function (name, username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, email, password: hashedPassword });
  await newUser.save();
};

const login = async function (username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }
  jwt.sign({ username: user.username }, "PROJECTWS", {
    expiresIn: "1h",
  });
  return user;
};

const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi",
    }),
    username: Joi.string().alphanum().required().messages({
      "any.required": "Semua Field Wajib Diisi",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Semua Field Wajib Diisi!",
      "string.empty": "Semua Field Wajib Diisi!",
      "string.email": "Format Email Salah!",
    }),
    password: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi",
    }),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().required().messages({
      "any.required": "Semua Field Wajib Diisi",
    }),
    password: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi",
    }),
  });
  return schema.validate(data);
};

module.exports = {
  register,
  login,
  validateRegistration,
  validateLogin,
};
