const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const authMiddleware = require("../app/middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/edit", authMiddleware, userController.editUser);

module.exports = router;
