const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/getAccessTokenFromSpotify",trackController.getAccessTokenFromSpotify);
router.get("/getTrackById/:trackId",trackController.getTrackById);
router.post("/createPlaylist",trackController.createPlayList);

module.exports = router;