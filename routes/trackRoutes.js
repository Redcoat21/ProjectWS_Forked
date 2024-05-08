const express = require("express");
const router = express.Router();
const trackController = require("../app/controllers/trackControler");
//const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/getApikey", trackController.getApikey);
router.get("/getTrackById/:trackId", trackController.getTrackById);
router.put("/createPlaylist", trackController.createPlayList);
module.exports = router;