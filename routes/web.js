const express = require("express");
const router = express.Router();

// const places = require("./controller/places");
// const general= require("./controller/general");
const test= require("../tests/testing");

// const assoc = require("../model/assoc");

// assoc();

router.use("/test",test);
// router.use("/places",places);

module.exports = router;