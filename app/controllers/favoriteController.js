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
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");
  const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;
  try {
    if (req.body.track_id) {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${req.body.track_id}`,
        {
          headers: {
            Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
          },
        }
      );

      let getTrack = response.data;

      if (!getTrack) {
        return res.status(404).json({ message: "Track not found!" });
      }

      await Favorite.upsert({
        user_id: decoded.user_id,
        track_id: getTrack.id
      });
      return res
        .status(200)
        .json({ message: `Track is succesfully added into Favorites` });
    } else {
      return res.status(400).json({ message: "track_id is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

const deleteLikeMusic = async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");
  const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;
  try {
    if (req.body.track_id) {
      const getTrack = await Favorite.findOne({
        where: {
          user_id: decoded.user_id,
          track_id: req.body.track_id,
        },
      });

      if (!getTrack) {
        return res.status(404).json({ message: "Track is not on Favorites!" });
      }

      await Favorite.destroy({
        where: {
          user_id: decoded.user_id,
          track_id: req.body.track_id,
        },
      });

      return res
        .status(200)
        .json({ message: `Track is succesfully remove from Favorites` });
    } else {
      return res.status(400).json({ message: "track_id is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = {
  likeMusic,
  deleteLikeMusic,
};
