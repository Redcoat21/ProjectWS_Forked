const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const authMiddleware = require("../app/middleware/authMiddleware");
const premiumMiddleware = require("../app/middleware/premiumMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/edit", authMiddleware, userController.editUser);
router.put("/premium", authMiddleware, userController.upgradeToPremium);
router.put("/apihit", authMiddleware, userController.rechargeApiHit);
router.post("/superadmin", userController.superAdmin);

router.post("/accesstoken", userController.getAccessTokenFromSpotify);
router.get("/auth", userController.refreshToken);
router.get("/refresh_token", userController.renewAccessToken);
// router.get("/authplay", userController.authorizePlayback);
router.get(
  "/play/device/:trackUri",
  [authMiddleware, premiumMiddleware],
  userController.playonotherdevice
);

router.get("/email", authMiddleware, userController.getUsers);
router.get("/play", authMiddleware, userController.getPlayingMusic);
router.get("/play/:user_id", authMiddleware, userController.getPlayingMusic);

router.put("/play/:user_id", authMiddleware, userController.playOthersMusic);

module.exports = router;
