const express = require("express");
const router = express.Router();
const authMiddleware = require("../app/middleware/authMiddleware")
const playlistController = require("../app/controllers/playlistController");

router.post("/", authMiddleware, playlistController.createPlayList);
router.delete("/:playlist_id", authMiddleware, playlistController.deletePlayList);
router.post("/track", authMiddleware, playlistController.InsertToPlayList);
router.delete(
  "/track/:playlist_id/:track_id",
  authMiddleware, playlistController.deleteTrackList
);

module.exports = router;
