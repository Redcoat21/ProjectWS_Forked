const express = require("express");
const router = express.Router();
const playlistController = require("../app/controllers/playlistController");

router.post("/", playlistController.createPlayList);
router.post("/track", playlistController.InsertToPlayList);
router.delete("/:playlist_id", playlistController.deletePlayList);
router.delete("/:playlist_id/:track_id", playlistController.deleteTrackList);
module.exports = router;
