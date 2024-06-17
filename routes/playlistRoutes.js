const express = require("express");
const router = express.Router();
const playlistController = require("../app/controllers/playlistController");
const authMiddleware = require("../app/middleware/authMiddleware");
router.post("/", authMiddleware,playlistController.createPlayList);
router.post("/track", authMiddleware,playlistController.InsertToPlayList);
router.delete("/:playlist_id",authMiddleware ,playlistController.deletePlayList);
router.delete("/:playlist_id/:track_id", authMiddleware,playlistController.deleteTrackList);
module.exports = router;
