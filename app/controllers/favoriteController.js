const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Favorite = require("../models/Favorites");
const Joi = require("joi");
const Service = require("../services/userService");
const Tracklist = require("../models/Tracklists");
const Sequelize = require("sequelize");

const likeMusic = async function (req, res) {
  const { track_name } = req.body;
  // get User id 
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");
  //const user = await User.findOne({ where: { user_id: decoded.user_id } });
  try {
    if (track_name) {
      const tracks = await Tracklist.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          'LIKE',
          `%${track_name.toLowerCase()}%`
        )
      });
  
      if (tracks.length > 0) {
        const favoritePromises = tracks.map(track => {
          return Favorite.create({
            tracklist_id: track.tracklist_id,
            user_id: decoded.user_id,
            url: track.url
          });
        });
  
        // Wait for all promises to resolve
        await Promise.all(favoritePromises);
  
        return res.status(200).json({ message: "success" });
      } else {
        return res.status(400).json({ message: "track not found" });
      }
    } else {
      return res.status(400).json({ message: "track_name is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
  
}


const deleteLikeMusic = async function (req, res) {
  const { track_name } = req.body;
  // get User id 
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");
  //const user = await User.findOne({ where: { user_id: decoded.user_id } });
  try {
    if (track_name) {
      const tracks = await Tracklist.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          'LIKE',
          `%${track_name.toLowerCase()}%`
        )
      });
  
      if (tracks.length > 0) {
        const favoritePromises = tracks.map(track => {
          return Favorite.destroy({
            where: {
              tracklist_id: track.tracklist_id,
              user_id: decoded.user_id  
            }
          });
        });
  
        // Wait for all promises to resolve
        await Promise.all(favoritePromises);
  
        return res.status(200).json({ message: "success" });
      } else {
        return res.status(400).json({ message: "track not found" });
      }
    } else {
      return res.status(400).json({ message: "track_name is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
  
}




module.exports = {
    likeMusic,
    deleteLikeMusic
};