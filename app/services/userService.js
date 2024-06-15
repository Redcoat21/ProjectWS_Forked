const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";
const axios = require("axios");
const querystring = require("querystring");

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const checkUsernameExist = async function (username) {
  const getusername = await User.findOne({
    where: {
      username: username,
    },
  });
  if (getusername) {
    User.username === username;
  } else {
    throw new Error("Username not found!");
  }
};

const checkUsernameNotExist = async function (username) {
  const getusername = await User.findOne({
    where: { username },
  });
  if (getusername) {
    throw new Error("Username already registered!");
  }
};

const storage = multer.diskStorage({
  destination: "./public/assets/",
  filename: function (req, file, cb) {
    // console.log(file);
    cb(null, "profile_" + Date.now() + path.extname(file.originalname));
    console.log(file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("profilePicture");

const refreshSpotifyToken = function (res) {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
  console.log(res);
  console.log(client_id);
};

module.exports = {
  checkUsernameExist,
  checkUsernameNotExist,
  upload,
  refreshSpotifyToken,
};
