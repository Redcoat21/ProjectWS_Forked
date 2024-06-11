const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");
const Playlist = require("../models/Playlists");
const querystring = require('querystring');
const Tracklist = require("../models/Tracklists");
const { URL } = require("url");
const { isArray } = require("util");
require("dotenv").config();
const ACCESS_KEY_SPOTIFY = process.env.ACCESS_KEY_SPOTIFY;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const Sequelize = require("sequelize");
const API_KEY_MUSIXMATCH = process.env.API_KEY_MUSIXMATCH;


//  yang harus diperhatiin makek axios spotify dev
//const client_id = "104508e989054f18865186f0df9a5f70";
// const client_secret ="87f4064dfa2f43ad85f7b4b99736fdf5";
//  client id sama secret itu dipakai ambil dari pas login baru create new app(kalo redirect url pakek localhost biar gk ribet)
// const access_token ="BQBmZWZmlx9T_rL2hVEtfhQ_MgUiB0nqkOTs8BkDt4JI9Q6JyGC4PfbXnVOeRsc6k9AhJDuJ6-N0PUxraVA9lV8TAI5z6NvuyHiPlXkptBZjRRaFNIc";
// accesstoken itu cuman bisa dipakai 1h doang buat makeknya 

// kalo pas coba error token expired (pertama kali) login spotify dev baru bikin new app buat ganti info client
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const getRefreshToken = async function (req, res) {

  // refresh token that has been previously stored

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';
  var redirect_uri = 'http://localhost:3000/callback';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    const refreshToken = req.body.refresh_token;

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refreshToken)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      );
  
      return res.status(200).send(response.data);
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(500).send("Internal Server Error");
    }
}

const getAccessTokenFromSpotify = async function (req, res) {
  try {
    console.log(client_id);
    console.log(client_secret);
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials&client_id=" +
      encodeURIComponent(client_id) +
      "&client_secret=" +
      encodeURIComponent(client_secret),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Hasil response nya adalah :", response.data);
   
    return res.status(200).json(response.data);
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors
  }
}; //buat dapetin apikey spotivynya

const getTrackById = async function (req, res) {
  const Id = req.params.Id;
  if (!Id) {
    return res
      .status(400)
      .json({ error: "trackId is missing in the request param" });
  }
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${Id}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY, // Make sure access_token is a valid OAuth token
        },
      }
    );
    let getOneSong = response.data;
    //return res.status(200).json(response.data);
    return res.status(200).send({
      nama_lagu: getOneSong.name,
      artis: getOneSong.album.artists[0].name,
      url: getOneSong.external_urls.spotify,
      complete: getOneSong,
    });
    // Send only the response data using res.json()
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    return res
      .status(error.response.status)
      .json({ error: error.response.data }); // Send error response
  }
}; // udh dapat

const getTrackByUrl = async function (req, res) {
  //const url = req.body.url;
  const url = req.params;
  if (!url) {
    return res
      .status(400)
      .json({ error: "URL is missing in the request body" });
  }
  const trackId = url.split("/").pop(); // Extract the track ID from the URL
  console.log(trackId); // Output: 6DCZcSspjsKoFjzjrWoCdn
  // return res.status(200).send({messege:trackId});
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY, // Make sure access_token is a valid OAuth token
        },
      }
    );
    let getOneSong = response.data;
    //return res.status(200).json(response.data);
    return res.status(200).send({
      nama_lagu: getOneSong.name,
      artis: getOneSong.album.artists[0].name,
      url: getOneSong.external_urls.spotify,
      complete: getOneSong,
    });
    // Send only the response data using res.json()
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    return res
      .status(error.response.status)
      .json({ error: error.response.data }); // Send error response
  }
}; //sudah bisa

const getTrackByUrlbody = async function (req, res) {
  //const url = req.body.url;
  const url = req.body.url;
  if (!url) {
    return res
      .status(400)
      .json({ error: "URL is missing in the request body" });
  }
  const trackId = url.split("/").pop(); // Extract the track ID from the URL
  console.log(trackId); // Output: 6DCZcSspjsKoFjzjrWoCdn
  // return res.status(200).send({messege:trackId});
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY, // Make sure access_token is a valid OAuth token
        },
      }
    );
    let getOneSong = response.data;
    //return res.status(200).json(response.data);
    return res.status(200).send({
      nama_lagu: getOneSong.name,
      artis: getOneSong.album.artists[0].name,
      url: getOneSong.external_urls.spotify,
      complete: getOneSong,
    });
    // Send only the response data using res.json()
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    return res
      .status(error.response.status)
      .json({ error: error.response.data }); // Send error response
  }
}; //sudah bisa

const getAlbumByUrl = async function (req, res) {
  const url = req.body.url;
  if (!url) {
    return res
      .status(400)
      .json({ error: "URL is missing in the request body" });
  }
  const albumId = url.split("/").pop();
  // Extract the track ID from the URL
  console.log(albumId); // Output: 6DCZcSspjsKoFjzjrWoCdn
  // return res.status(200).send({messege:trackId});
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: "Bearer " + ACCESS_KEY_SPOTIFY, // Make sure access_token is a valid OAuth token
        },
      }
    );
    //let getOneSong = response.data;
    return res.status(200).json(response.data);
    // Send only the response data using res.json()
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    return res
      .status(error.response.status)
      .json({ error: error.response.data }); // Send error response
  }
};

const getTrackByName = async function (req, res) {
  const searchTrack = req.body.searchTrack;
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: `name: ${searchTrack}`,
        type: "track",
      },
      headers: {
        Authorization: "Bearer " + ACCESS_KEY_SPOTIFY, // Make sure access_token is a valid OAuth token
      },
    });
    let getAllSong = response.data.tracks.items;
    let getAllSongs = response.data;
    const isarray = Array.isArray(getAllSongs);
    return res.status(200).send({
      isarray: isarray,
      allsongs: getAllSong,
    });
    // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error.response.data);
    // Handle errors
  }
}; //masih bingung cara returnnya

const play = async function (req, res) {
  try {
    const id_music = req.params.id;

    if (id_music != null) {
      const track = await Tracklist.findOne({
        attributes: ["name"], // column yang nanti ditampilkan
        where: { tracklist_id: id_music },
      });

      if (track != null) {
        const token = req.header("x-auth-token");
        if (!token) {
          return res.status(401).json({ error: "Access token missing" });
        }

        const decoded = jwt.verify(token, "PROJECTWS");
        const user = await User.findOne({
          where: { user_id: decoded.user_id },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        await user.update({ now_playing: track.name });

        return res.status(200).json({ track: track.name, user: user.name });
      } else {
        return res.status(404).json({ error: "Music not found" });
      }
    } else {
      return res.status(400).json({ error: "Music ID is missing" });
    }
  } catch (error) {
    console.error("Error updating now_playing:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getLyrics = async function (req, res) {
  try {
    const { id } = req.params;
    console.log(API_KEY_MUSIXMATCH);
    const response = await axios.get("https://api.musixmatch.com/ws/1.1/track.lyrics.get", {
      params: {
        // track_id: 283840831,
        track_id: id,
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
}

module.exports = {
  getAccessTokenFromSpotify,
  getRefreshToken,
  getLyrics,
  getTrackById,
  getTrackByUrl,
  getTrackByUrlbody,
  getAlbumByUrl,
  getTrackByName,
  play,
};

