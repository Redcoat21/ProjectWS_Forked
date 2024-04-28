const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  api_hit: { type: Number, default: 0 },
  api_key: String,
  premium: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
