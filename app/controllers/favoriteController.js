const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Favorite = require("../models/Favorites");
const Joi = require("joi");
const Service = require("../services/userService");
const Tracklist = require("../models/Tracklists");
const Sequelize = require("sequelize");
const axios = require("axios");



const likeMusic = async function (req, res) {
  // Schema untuk validasi track_id
  const schema = Joi.object({
    track_id: Joi.string().required().messages({
      'string.base': 'Track ID should be a string',
      'any.required': 'Track ID is required',
    }),
  });

  try {
    // Validasi req.body terhadap schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join('; ');
      return res.status(400).json({ message: errorMessage });
    }

    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, "PROJECTWS");
    const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;

    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${req.body.track_id}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
        },
      }
    );

    const getTrack = response.data;

    if (!getTrack) {
      return res.status(404).json({ message: "Track not found!" });
    }

    await Favorite.upsert({
      user_id: decoded.user_id,
      track_id: getTrack.id,
    });

    return res.status(200).json({
      message: `Track is successfully added into Favorites`,
    });

  } catch (error) {
    console.error("Error fetching data:", error.response?.data);
    return res.status(error.response?.status || 500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const deleteLikeMusic = async function (req, res) {
  // Schema untuk validasi track_id
  const schema = Joi.object({
    track_id: Joi.string().required().messages({
      'string.base': 'Track ID should be a string',
      'any.required': 'Track ID is required',
    }),
  });

  try {
    // Validasi req.body terhadap schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join('; ');
      return res.status(400).json({ message: errorMessage });
    }

    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, "PROJECTWS");

    // Cari track yang ada di Favorite
    const getTrack = await Favorite.findOne({
      where: {
        user_id: decoded.user_id,
        track_id: req.body.track_id,
      },
    });

    if (!getTrack) {
      return res.status(404).json({ message: "Track is not in Favorites!" });
    }

    // Hapus track dari Favorite
    await Favorite.destroy({
      where: {
        user_id: decoded.user_id,
        track_id: req.body.track_id,
      },
    });

    return res.status(200).json({
      message: `Track is successfully removed from Favorites`,
    });

  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = {
  likeMusic,
  deleteLikeMusic,
};
