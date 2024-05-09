const multer = require("multer");
const User = require("../models/User");
const path = require("path");

const checkUsernameExist = async function (username) {
  const getusername = User.findOne({
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
    where: {username},
  });
  if (getusername) {
    throw new Error("Username already registered!");
  }
};

const storage = multer.diskStorage({
  destination: "./public/assets",
  filename: function (req, file, cb) {
    // console.log(file);
    cb(null, "profile_" + Date.now() + path.extname(file.originalname));
    console.log(file.originalname)
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("profilePicture");

module.exports = {
  checkUsernameExist,
  checkUsernameNotExist,
  upload,
};
