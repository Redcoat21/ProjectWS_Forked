const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");
const Playlist = require("../models/Playlist");
const Tracklist = require("../models/Tracklist");

const client_id = "104508e989054f18865186f0df9a5f70";
//ini client_id punyaku
const client_secret ="87f4064dfa2f43ad85f7b4b99736fdf5";
//ini client_secret punyaku
const access_token ="BQBmZWZmlx9T_rL2hVEtfhQ_MgUiB0nqkOTs8BkDt4JI9Q6JyGC4PfbXnVOeRsc6k9AhJDuJ6-N0PUxraVA9lV8TAI5z6NvuyHiPlXkptBZjRRaFNIc";
//ini access_token punyaku

// apikeynya diblokir bisa langsung login spotify dev 
//habis itu kalian dapat client_id dan client_secret 
//habis itu7 kalian run http://localhost:3000/track/getApikey btw jangan lupa client_secret dan client_id nya diganti punya kalian
const getApikey = async function (req, res) {
    //const {client_id,client_secret} = req.body;
    try {
      const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials&client_id=' + encodeURIComponent(client_id) + '&client_secret=' + encodeURIComponent(client_secret),
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }
      );

      console.log('Hasil response nya adalah :', response.data);
      return res.status(200).json(response.data);
      // Handle the response data as needed
  } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors
  }

};//buat dapetin apikey spotivynya

const getTrackById = async function (req, res) {
  const trackId = req.params.trackId; // Retrieve trackId from request parameters
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': 'Bearer ' + access_token // Make sure access_token is a valid OAuth token
        }
    });

    return res.status(200).json(response.data); // Send only the response data using res.json()
    // Handle the response data as needed
  } catch (error) {
      console.error('Error fetching data:', error.response.data);
      return res.status(error.response.status).json({ error: error.response.data }); // Send error response
  }
};// udh dapat


const createPlayList = async function (req, res) {
    const {playlistname,description} = req.body;
    const countPlay = await Playlist.count();
    let ids = "";
    if (countPlay > 9) {
        ids = "PL0"+(countPlay+1);
    } else if (countPlay > 99) {
        ids = "PL"+(countPlay+1);
    } else{
        ids = "PL00"+(countPlay+1);
    }
    const createPlaylist = Playlist.create({
        playlist_id : ids,
        name:playlistname,
        description:description
    });
  };

const InsertToPlayList = async function (req, res) {
    const {playlistname,description} = req.body;
    const countPlay = await Tracklist.count();
    let ids = "";
    if (countPlay > 9) {
        ids = "PL0"+(countPlay+1);
    } else if (countPlay > 99) {
        ids = "PL"+(countPlay+1);
    } else{
        ids = "PL00"+(countPlay+1);
    }
    const createPlaylist = Playlist.create({
        playlist_id : ids,
        name:playlistname,
        description:description
    });
  };


  // CREATE TABLE `playlists` (
//   `playlist_id` VARCHAR(5) PRIMARY KEY,
//   `name` VARCHAR(255) NOT NULL,
//   `description` VARCHAR(255) NULL,
//   `user_id` VARCHAR(6) REFERENCES users(user_id)
// );
const getTrackByName = async function (req, res) {
  const searchTrack = req.query.searchTrack;
  try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
          params: {
              q: searchTrack,
              type: 'track'
          },
          headers: {
              'Authorization': 'Bearer ' + access_token // Make sure access_token is a valid OAuth token
          }
      });
      return res.status(200).json(response.data);
      // Handle the response data as needed
  } catch (error) {
      console.error('Error fetching data:', error.response.data);
      // Handle errors
  }
};//masih error


module.exports = {
    getApikey,
    getTrackById,
    getTrackByName,
    createPlayList
  };


// const getTrack = async function (req, res) {
//     const {trackId} = req.body;
//     try {
//         const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
//           headers: {
//             'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 
//           }
//         });
//         return res.status(200).json(response);
//         // Handle the response data as needed
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         // Handle errors
//       }

// };




    // const authToken = req.header("x-auth-token");

    // try {
    //   let user;
    //   if (authToken) {
    //     user = await User.findOne({ where: { username } });

    //     if (!user) {
    //       return res.status(404).json({ error: "User not found" });
    //     }
    //     if (user.api_key !== authToken) {
    //       return res.status(401).json({ error: "Invalid authentication token" });
    //     }
    //     const passwordMatch = await bcrypt.compare(password, user.password);
    //     if (!passwordMatch) {
    //       return res.status(401).json({ error: "Incorrect password" });
    //     }
    //   } else {
    //     return res.status(403).json({ message: "Forbidden" });
    //   }

    //   const token = jwt.sign({ user_id: user.user_id }, "PROJECTWS", {
    //     expiresIn: "1h",
    //   });
    //   return res.status(200).json({ message: "Login successful", token });
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ error: "Could not log in" });
    // }