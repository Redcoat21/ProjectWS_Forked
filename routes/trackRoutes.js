const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const favoriteController = require("../app/controllers/favoriteController");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/accesstoken", trackController.getAccessTokenFromSpotify);

// router.get("/getTrackById/:trackId",trackController.getTrackById);
// router.get("/getTrackById/:trackId",trackController.getTrackById);
router.get("/:id", trackController.getTrackById);
//router.get("/getTrackByUrl",trackController.getTrackByUrl);
// router.get("/search/:url",trackController.getTrackByUrl);
// router.get("/search",trackController.getTrackByUrlbody);
// router.get("/getAlbumByUrl",trackController.getAlbumByUrl);
// router.get("/getTrackByNama",trackController.getTrackByName);

//rey
router.post("/favorite", authMiddleware, favoriteController.likeMusic);
router.delete("/favorite", authMiddleware, favoriteController.deleteLikeMusic);

router.get("/play/:id", authMiddleware, trackController.play);

module.exports = router;
