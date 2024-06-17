const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const favoriteController = require("../app/controllers/favoriteController");
const authMiddleware = require("../app/middleware/authMiddleware");
const premiumMiddleware = require("../app/middleware/premiumMiddleware");

router.get("/:id", authMiddleware, trackController.getTrackById);
router.get(
  "/lyric/:id",
  authMiddleware,
  premiumMiddleware,
  trackController.getLyrics
);
router.get("/chart/:country/:row", authMiddleware, trackController.chartTrack);

//rey
router.post("/favorite", favoriteController.likeMusic);
router.delete("/favorite", favoriteController.deleteLikeMusic);

router.put("/play", trackController.play);

module.exports = router;
