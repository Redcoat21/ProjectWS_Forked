const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("joi");
const Service = require("../services/userService");
const multer = require("multer");
const { Sequelize, Op } = require("sequelize");
const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const API_KEY_MUSIXMATCH = process.env.API_KEY_MUSIXMATCH;

const register = async function (req, res) {
  Service.upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File size limit exceeded" });
    } else if (err) {
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const schema = Joi.object({
      name: Joi.string().required().messages({
        "any.required": "Semua Field Wajib Diisi!",
      }),
      username: Joi.string()
        .required()
        .external(Service.checkUsernameNotExist)
        .messages({
          "any.required": "Semua Field Wajib Diisi!",
        }),
      email: Joi.string().email().required().messages({
        "any.required": "Semua Field Wajib Diisi!",
        "string.empty": "Semua Field Wajib Diisi!",
        "string.email": "Format Email Salah!",
      }),
      password: Joi.string().required().messages({
        "any.required": "Semua Field Wajib Diisi!",
      }),
    });

    try {
      await schema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.toString());
    }

    const { name, username, email, password } = req.body;
    const profilePicture = req.file ? req.file.path : null;

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
        profile_pic: profilePicture,
      });
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          user_id: user.user_id,
          name: user.name,
          username: user.username,
          email: user.email,
          balance: user.balance,
          api_key: user.api_key,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not register user" });
    }
  });
};

const login = async function (req, res) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .external(Service.checkUsernameExist)
      .messages({
        "any.required": "Semua Field Wajib Diisi!",
      }),
    password: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi!",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.toString());
  }

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
      if (!isNaN(parseInt(topup))) {
        user.balance += parseInt(topup);
      } else {
        return res.status(400).json({ error: "Topup amount is not a number" });
      }
    }

    user.api_hit -= 3;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user: {
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        balance: user.balance,
        api_hit: user.api_hit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update user profile" });
  }
};

const upgradeToPremium = async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  try {
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    if (user.premium) {
      return res.status(400).json({ error: "User is already Premium" });
    }

    const premiumCharge = 55000;
    if (user.balance < premiumCharge) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.balance -= premiumCharge;
    user.premium = true;

    await user.save();

    return res.status(200).json({ message: "User upgraded to Premium" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not upgrade user to Premium" });
  }
};

const rechargeApiHit = async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  const schema = Joi.object({
    amount: Joi.number().required().messages({
      "any.required": "Semua Field Wajib Diisi!",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.toString());
  }

  const amount = req.body.amount;

  try {
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    const bills = amount * 5000;

    if (user.balance < bills) {
      return res.status(400).json({
        error: `Insufficient balance (Current balance : Rp. ${user.balance}, API HIT Total Price: Rp. ${bills})`,
      });
    }
    const parsed = parseInt(amount) + 1;
    user.api_hit += parsed;
    user.balance -= bills;

    await user.save();

    res.status(200).json({
      message: `API-hit recharged successfully (Current balance: Rp. ${user.balance})`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not recharge API-hit" });
  }
};

const getAccessTokenFromSpotify = async function (req, res) {
  try {
    console.log(client_id);
    console.log(client_secret);
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials&client_id=" +
        encodeURIComponent(client_id) +
        "&client_secret=" +
        encodeURIComponent(client_secret),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const refreshToken = function (req, res) {
  Service.refreshSpotifyToken(res, (error, tokens) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.send(tokens);
    }
  });
};

//rey
const getUsers = async function (req, res) {
  try {
    const users = await User.findAll({
      attributes: ["name", "username", "email"],
    }); // Mengambil semua data user dari database
    res.status(200).json({ Users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve users" });
  }
};

// tambahkan kolom now playing ya, di db sama model ntar di update
const getPlayingMusic = async function (req, res) {
  var user_id = req.params.user_id;
  if (user_id != null) {
    const user = await User.findAll({
      attributes: ["username", "now_playing"], // column yang nanti ditampilkan
      where: {
        now_playing: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    if (user != null) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } else {
    return res.status(400).json({ error: "User not found 20" });
  }
};

module.exports = {
  register,
  login,
  editUser,
  upgradeToPremium,
  rechargeApiHit,
  getAccessTokenFromSpotify,
  refreshToken,
  getUsers, // bagian ini hanya untuk mengecek isi user dari database, dari Reynard
  getPlayingMusic,
};
