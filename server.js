const express = require("express");
const web = require("./routes/web");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const axios =require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", web);

app.get('/callback', async function (req, res) {
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
