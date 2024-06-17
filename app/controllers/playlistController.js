const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Playlist = require("../models/Playlists");
const Tracklist = require("../models/Tracklists");
const Sequelize = require("sequelize");
const axios = require("axios");
const Joi = require("joi");
const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;

const createPlayList = async function (req, res) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).send("require user token");
  }
  const decoded = jwt.verify(token, "PROJECTWS");

  const user = await User.findOne({
    where: { user_id: decoded.user_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  if (user.api_hit < 3) {
    return res.status(400).json({ message: "API HIT is insufficient" });
  }

  user.api_hit -= 3;
  await user.save();

  const countPlay = await Playlist.count();
  const newPlay = parseInt(countPlay) + 1;
  const idcount = newPlay.toString().padStart(3, "0");
  const id_playlist = `PL${idcount}`;
  const { name, description } = req.body;
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi!",
    }),
    description: Joi.string().required().messages({
      "any.required": "Semua Field Wajib Diisi!",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.toString());
  }

  await Playlist.create({
    playlist_id: id_playlist,
    name: name,
    description: description,
    user_id: decoded.user_id,
  });

  return res.status(200).json({
    message: "Playlist successfuly created",
    playlist_id: id_playlist,
    name: req.body.name,
    description: req.body.description,
  });
};

const deletePlayList = async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  const user = await User.findOne({
    where: { user_id: decoded.user_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  if (user.api_hit < 1) {
    return res.status(400).json({ message: "API HIT is insufficient" });
  }

  const SearchPlaylist = await Playlist.findOne({
    where: { playlist_id: req.params.playlist_id, user_id: decoded.user_id },
  });

  if (!SearchPlaylist) {
    return res.status(404).json({ message: "Playlist not found!" });
  }

  await Tracklist.destroy({
    where: { playlist_id: req.params.playlist_id },
  });

  await Playlist.destroy({
    where: { playlist_id: req.params.playlist_id },
  });

  user.api_hit -= 1;
  await user.save();

  return res.status(200).json({
    message: `${SearchPlaylist.name} has been deleted`,
  });
};

const InsertToPlayList = async function (req, res) {
  const track_id = req.body.track_id;
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");
  if (!track_id) {
    return res.status(400).json({ message: "Track_ID required" });
  }
  const user = await User.findOne({
    where: { user_id: decoded.user_id },
  });

  const playlist = await Playlist.findOne({
    where: { playlist_id: req.body.playlist_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found!" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${track_id}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
        },
      }
    );

    let getOneSong = response.data;

    await Tracklist.create({
      name: getOneSong.name,
      playlist_id: req.body.playlist_id,
      track_id: track_id,
    });

    return res.status(200).send({
      message: `${getOneSong.name} has been added to ${playlist.name}`,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(400).json({ error: error.response }); // Send error response
  }
};

const deleteTrackList = async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  const user = await User.findOne({
    where: { user_id: decoded.user_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const playlist = await Playlist.findOne({
    where: {
      user_id: decoded.user_id,
      playlist_id: req.params.playlist_id,
    },
  });

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found!" });
  }

  const track = await Tracklist.findOne({
    where: {
      playlist_id: req.params.playlist_id,
      track_id: req.params.track_id,
    },
  });

  if (!track) {
    return res.status(404).json({ message: "Track not found" });
  }

  await Tracklist.destroy({
    where: {
      playlist_id: req.params.playlist_id,
      track_id: req.params.track_id,
    },
  });

  return res
    .status(200)
    .json({ message: `${track.name} has been removed from the playlist` });
};

module.exports = {
  createPlayList,
  deletePlayList,
  InsertToPlayList,
  deleteTrackList,
};
