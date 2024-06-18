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
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    const decoded = jwt.verify(token, "PROJECTWS");
    const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;

    let trackId = req.body.track_id;
    let getTrack;

    // Cek apakah track_id adalah nama lagu atau id track
    if (!isTrackId(trackId)) {
      // Jika bukan id track, cari track berdasarkan nama
      getTrack = await searchTrackByName(trackId, ACCESS_KEY_SPOTIFY);
      if (!getTrack) {
        return res.status(404).json({ message: "Track not found!" });
      }
      trackId = getTrack.id;
    } else {
      // Jika track_id adalah id track, langsung cari track berdasarkan id
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
          },
        }
      );
      getTrack = response.data;
      if (!getTrack) {
        return res.status(404).json({ message: "Track not found!" });
      }
    }

    // Cek apakah track sudah ada di daftar favorit
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: decoded.user_id,
        track_id: trackId,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: `Track '${getTrack.name}' is already in your Favorites`,
      });
    }

    // Simpan track ke dalam daftar favorit
    await Favorite.upsert({
      user_id: decoded.user_id,
      track_id: getTrack.id,
    });

    return res.status(200).json({
      message: `Track '${getTrack.name}' is successfully added into Favorites`,
    });

  } catch (error) {
    console.error("Error fetching data:", error.response?.data);
    return res.status(error.response?.status || 500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// Fungsi untuk memeriksa apakah input adalah id track atau nama lagu
function isTrackId(input) {
  // Disini bisa dilakukan validasi lebih kompleks sesuai kebutuhan
  return /^[0-9A-Za-z]{22}$/.test(input); // Contoh sederhana, misalnya id track adalah 22 karakter alfanumerik
}

// Fungsi untuk mencari track berdasarkan nama
async function searchTrackByName(trackName, accessToken) {
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return response.data.tracks.items[0];
}

// Fungsi untuk mencari track berdasarkan nama
async function searchTrackByName(trackName, accessToken) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      return tracks[0]; // Mengembalikan track pertama dari hasil pencarian
    }
    return null; // Jika tidak ditemukan track dengan nama tersebut
  } catch (error) {
    console.error("Error searching track:", error.response?.data);
    throw error; // Melempar error untuk ditangani oleh blok catch di fungsi utama
  }
}

// Fungsi untuk memeriksa apakah input adalah id track atau nama lagu
function isTrackId(input) {
  // Disini bisa dilakukan validasi lebih kompleks sesuai kebutuhan
  return /^[0-9A-Za-z]{22}$/.test(input); // Contoh sederhana, misalnya id track adalah 22 karakter alfanumerik
}

// Fungsi untuk mencari track berdasarkan nama
async function searchTrackByName(trackName, accessToken) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        trackName
      )}&type=track`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      return tracks[0]; // Mengembalikan track pertama dari hasil pencarian
    }
    return null; // Jika tidak ditemukan track dengan nama tersebut
  } catch (error) {
    console.error("Error searching track:", error.response?.data);
    throw error; // Melempar error untuk ditangani oleh blok catch di fungsi utama
  }
}

const deleteLikeMusic = async function (req, res) {
  // Schema untuk validasi track_id
  const schema = Joi.object({
    track_id: Joi.string().required().messages({
      "string.base": "Track ID should be a string",
      "any.required": "Track ID is required",
    }),
  });

  try {
    // Validasi req.body terhadap schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join("; ");
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
