const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const trackRoutes = require("./trackRoutes");
const playlistRoutes = require("./playlistRoutes");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";
const axios = require("axios");
const test = require("../tests/testing");

router.use("/test", test);
router.use("/user", userRoutes);
router.use("/track", trackRoutes);
router.use("/playlist", playlistRoutes);
router.get('/callback', async function (req, res) {
    const code = req.query.code; // Assuming the authorization code is sent as a query parameter
  
    try {
      // Exchange authorization code for access token
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        `grant_type=authorization_code&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirect_uri)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      );
  
      // Send the access token back to the client
      res.status(200).send(response.data);
    } catch (error) {
      console.error("Error exchanging authorization code for access token:", error);
      res.status(500).send("Internal Server Error");
    }
  });
module.exports = router;
