const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

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

const refreshSpotifyToken = function (refresh_token, callback) {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      callback(null, { access_token, refresh_token });
    } else {
      callback(error || new Error("Failed to refresh token"));
    }
  });
};

module.exports = {
  checkUsernameExist,
  checkUsernameNotExist,
  upload,
  refreshSpotifyToken,
};
