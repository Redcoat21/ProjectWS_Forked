const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/getApikey",trackController.getAccessTokenFromSpotify);
router.get("/getTrackById/:trackId",authMiddleware,trackController.getTrackById);
router.put("/createPlaylist",authMiddleware,trackController.createPlayList);
module.exports = router;