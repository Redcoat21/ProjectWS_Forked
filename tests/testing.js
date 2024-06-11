const express = require("express");
const router = express.Router();
const axios = require("axios");
const API_KEY_MUSIXMATCH = process.env.API_KEY_MUSIXMATCH;

router.get("/", (req, res) => {
    return res.status(200).send("testing");
});

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
