const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: "./public/assets",
  filename: function (req, file, cb) {
    cb(null, "profile_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("profilePicture");

const register = async function (req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File size limit exceeded" });
    } else if (err) {
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const { name, username, email, password } = req.body;
    const profilePicturePath = req.file ? req.file.path : null;

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
        profile_pic: profilePicturePath,
      });
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not register user" });
    }
  });
};

const login = async function (req, res) {
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
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not log in" });
  }
};

const editUser = async function (req, res) {
  const { name, email, username, password, topup } = req.body;
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  try {
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (topup) {
      user.balance += parseInt(topup);
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update user profile" });
  }
};

module.exports = { register, login, editUser };
