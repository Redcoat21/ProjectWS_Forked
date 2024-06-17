const express = require("express");
const router = express.Router();
// const authMiddleware = require("../app/middleware/authMiddleware")
const playlistController = require("../app/controllers/playlistController");

router.post("/", playlistController.createPlayList);
router.delete("/:playlist_id", playlistController.deletePlayList);
router.post("/track", playlistController.InsertToPlayList);
router.delete(
  "/track/:playlist_id/:track_id",
  playlistController.deleteTrackList
);

module.exports = router;
