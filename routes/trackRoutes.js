const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const favoriteController = require("../app/controllers/favoriteController");
const authMiddleware = require("../app/middleware/authMiddleware");


router.get("/:id", authMiddleware, trackController.getTrackById);
router.get("/lyric/:id",authMiddleware, trackController.getLyrics);
router.get("/chart/:country/:row",authMiddleware, trackController.chartTrack);

//rey
router.post("/favorite", authMiddleware, favoriteController.likeMusic);
router.delete("/favorite", authMiddleware, favoriteController.deleteLikeMusic);

router.get("/play/:id", authMiddleware, trackController.play);


module.exports = router;
