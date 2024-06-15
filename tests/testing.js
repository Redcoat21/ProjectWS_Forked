const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const API_KEY_MUSIXMATCH = process.env.API_KEY_MUSIXMATCH;
const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;
const jwt = require("jsonwebtoken");
const client_id = process.env.CLIENT_ID;
const User = require("../app/models/User");
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";
const querystring = require("querystring");
require("dotenv").config();

router.get("/", (req, res) => {
  return res.status(200).send("testing");
});
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const refreshToken = function (req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
  console.log(res);
};

router.get("/refresh", refreshToken);


router.get("/music", async function (req, res) {
  try {
    console.log(API_KEY_MUSIXMATCH);
    const response = await axios.get("https://api.musixmatch.com/ws/1.1/track.search", {
      params: {
        q_artist: "justin bieber", page_size: 3, page: 1, s_track_rating: "desc",
        apikey: API_KEY_MUSIXMATCH,
      },
    });

    // Check if the response status is successful (200)
    if (response.status === 200) {
      const lyricres = response.data;
      // Set the response content type to HTML and send the modified HTML response
      console.log(lyricres)
      return res.status(200).send(lyricres);
    } else {
      throw new Error("Musixmatch API request failed with status code " + response.status);
    }
  } catch (error) {
    console.error("Error fetching data from Musixmatch:", error);
    return res.status(500).send("Internal Server Error"); // Change to 500 status code for internal server error
  }
});
router.get("/lyrics/:id", async function (req, res) {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "PROJECTWS");

  const user = await User.findOne({
    where: { user_id: decoded.user_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ error: "trackId is missing in the request param" });
  }
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
        },
      }
    );
    let getOneSong = response.data;
    const songname = getOneSong.name;
    const responsesong = await axios.get("https://api.musixmatch.com/ws/1.1/track.search", {
      params: {
        q_track: songname, page_size: 1, page: 1, s_track_rating: "desc",
        apikey: API_KEY_MUSIXMATCH,
      },
    });

    // Check if the response status is successful (200)
    if (responsesong.status === 200) {
      const lyricres = responsesong.data;
      console.log(lyricres.message.body.track_list[0].track.track_id)
      const responselyric = await axios.get("https://api.musixmatch.com/ws/1.1/track.lyrics.get", {
        params: {
          track_id: lyricres.message.body.track_list[0].track.track_id,
          apikey: API_KEY_MUSIXMATCH,
        },
      });

      if (responselyric.status === 200) {

        const lyricsBody = responselyric.data.message.body.lyrics.lyrics_body;
        console.log(lyricsBody);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(lyricsBody);
      } else {
        throw new Error("Musixmatch API request failed with status code " + response.status);
      }
    } else {
      throw new Error("Musixmatch API request failed with status code " + response.status);
    }

  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    return res
      .status(error.response.status)
      .json({ error: error.response.data });
  }
});

router.get("/translate", async function (req, res) {
  try {
    console.log(API_KEY_MUSIXMATCH);
    const response = await axios.get("https://api.musixmatch.com/ws/1.1/track.lyrics.get", {
      params: {
        track_id: 283840831,
        apikey: API_KEY_MUSIXMATCH,
      },
    });

    // Check if the response status is successful (200)
    if (response.status === 200) {
      // Add Musixmatch tracking script dynamically to the HTML response
      // const trackingScript = `<script type="text/javascript" src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"></script>`;
      // const trackingimgScript = `<img src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuXW">`;

      const lyricsBody = response.data.message.body.lyrics.lyrics_body;
      // Modify the HTML content of the response to include the tracking script
      // const htmlResponse = `
      //     <!DOCTYPE html>
      //     <html lang="en">
      //     <head>
      //         <meta charset="UTF-8">
      //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //         <title>Translate Page</title>
      //         ${trackingScript}
      //         ${trackingimgScript}
      //     </head>
      //     <body>
      //         <h1>Translate Page</h1>
      //         <p>Lyrics: ${lyricsBody}</p>
      //     </body>
      //     </html>
      // `;
      // const lyricres = response.data;
      // Set the response content type to HTML and send the modified HTML response
      // console.log(lyricres)
      console.log(lyricsBody);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(lyricsBody);
    } else {
      throw new Error("Musixmatch API request failed with status code " + response.status);
    }
  } catch (error) {
    console.error("Error fetching data from Musixmatch:", error);
    return res.status(500).send("Internal Server Error"); // Change to 500 status code for internal server error
  }
});

module.exports = router;
