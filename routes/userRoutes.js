const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/edit", authMiddleware, userController.editUser);
router.put("/premium", authMiddleware, userController.upgradeToPremium);
router.put("/apihit", authMiddleware, userController.rechargeApiHit);

module.exports = router;
