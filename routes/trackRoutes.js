const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/getAccessTokenFromSpotify",trackController.getAccessTokenFromSpotify);
// router.get("/getTrackById/:trackId",trackController.getTrackById);
router.get("/getTrackById/:trackId",trackController.getTrackById);
router.get("/getTrackByUrl",trackController.getTrackByUrl);
router.get("/getAlbumByUrl",trackController.getAlbumByUrl);
router.get("/getTrackByNama",trackController.getTrackByName);
router.post("/playlist",trackController.createPlayList);
router.post("/tracklist",trackController.InsertToPlayList);
router.delete("/playlist/:playlist_id",trackController.deletePlayList);
//router.delete("/tracklist/:playlist_id/:name",trackController.deletePlayList);



module.exports = router;