const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const trackRoutes = require("./trackRoutes");
const test = require("../tests/testing");

router.use("/test", test);
router.use("/user", userRoutes);
router.use("/track", trackRoutes);

module.exports = router;
