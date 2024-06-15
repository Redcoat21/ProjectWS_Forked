const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const API_KEY_MUSIXMATCH = process.env.API_KEY_MUSIXMATCH;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";
const querystring = require("querystring");
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
  
router.get("/refresh",refreshToken);


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
   
  const id = req.params.id;
  console.log(id)
  if (!id) {
    return res
      .status(400)
      .json({ error: "trackId is missing in the request param" });
  }
  try {
    const responsesong = await axios.get(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY,
        },
      }
    );
    let getOneSong = responsesong.data;
       const songname= getOneSong.name;
       console.log(songname)
    //    return res.status(500).send(songname);
    //     try {
    //         console.log(API_KEY_MUSIXMATCH);
    //         const response = await axios.get("https://api.musixmatch.com/ws/1.1/track.search", {
    //             params: {
    //                 q_track: songname, page_size: 3, page: 1, s_track_rating: "desc",
    //                 apikey: API_KEY_MUSIXMATCH,
    //             },
    //         });
    
    //         // Check if the response status is successful (200)
    //         if (response.status === 200) {
    //             const lyricres = response.data;
    //             // Set the response content type to HTML and send the modified HTML response
    //             console.log(lyricres)
    //             return res.status(200).send(lyricres);
    //         } else {
    //             throw new Error("Musixmatch API request failed with status code " + response.status);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data from Musixmatch:", error);
    //         return res.status(500).send("Internal Server Error"); // Change to 500 status code for internal server error
    //     }
    return res.status(200).send({
        name: getOneSong.name,
        artist: getOneSong.album.artists[0].name,
        url: getOneSong.external_urls.spotify,
    });
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
