const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const Tracklist = require("../models/Tracklists");
const { URL } = require("url");
require('dotenv').config();
const ACCESS_KEY_SPOTIFY= process.env.ACCESS_KEY_SPOTIFY;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

//const client_id = "104508e989054f18865186f0df9a5f70";
//ini client_id punyaku
// const client_secret ="87f4064dfa2f43ad85f7b4b99736fdf5";
// //ini client_secret punyaku
// const access_token ="BQBmZWZmlx9T_rL2hVEtfhQ_MgUiB0nqkOTs8BkDt4JI9Q6JyGC4PfbXnVOeRsc6k9AhJDuJ6-N0PUxraVA9lV8TAI5z6NvuyHiPlXkptBZjRRaFNIc";
//ini access_token punyaku

// apikeynya diblokir bisa langsung login spotify dev 
//habis itu kalian dapat client_id dan client_secret 
//habis itu7 kalian run http://localhost:3000/track/getApikey btw jangan lupa client_secret dan client_id nya diganti punya kalian

const getAccessTokenFromSpotify = async function (req, res) {
    try {
        console.log(client_id);
        console.log(client_secret);
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
    const trackId = req.params.trackId;
    if (!trackId) {
        return res.status(400).json({ error: "trackId is missing in the request param" });
    }
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
              'Authorization': 'Bearer ' + ACCESS_KEY_SPOTIFY // Make sure access_token is a valid OAuth token
          }
      });
      let getOneSong = response.data;
      //return res.status(200).json(response.data); 
      return res.status(200).send({
          nama_lagu : getOneSong.name,
          artis : getOneSong.album.artists[0].name,
          url:getOneSong.external_urls.spotify,
          complete :getOneSong
      });
      // Send only the response data using res.json()
      // Handle the response data as needed
    } catch (error) {
        console.error('Error fetching data:', error.response.data);
        return res.status(error.response.status).json({ error: error.response.data }); // Send error response
    }
};// udh dapat


const getTrackByUrl = async function (req, res) {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: "URL is missing in the request body" });
    }
    const trackId = url.split("/").pop(); // Extract the track ID from the URL
    console.log(trackId); // Output: 6DCZcSspjsKoFjzjrWoCdn
    // return res.status(200).send({messege:trackId}); 
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
              'Authorization': 'Bearer ' + ACCESS_KEY_SPOTIFY // Make sure access_token is a valid OAuth token
          }
      });
      let getOneSong = response.data;
      //return res.status(200).json(response.data); 
      return res.status(200).send({
          nama_lagu : getOneSong.name,
          artis : getOneSong.album.artists[0].name,
          url:getOneSong.external_urls.spotify,
          complete :getOneSong
      });
      // Send only the response data using res.json()
      // Handle the response data as needed
    } catch (error) {
        console.error('Error fetching data:', error.response.data);
        return res.status(error.response.status).json({ error: error.response.data }); // Send error response
    }
};//sudah bisa


const getAlbumByUrl = async function (req, res) {
    const url = req.body.url
    if (!url) {
        return res.status(400).json({ error: "URL is missing in the request body" });
    };
    const albumId = url.split("/").pop();
    // Extract the track ID from the URL
    console.log(albumId); // Output: 6DCZcSspjsKoFjzjrWoCdn
    // return res.status(200).send({messege:trackId}); 
    try {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: {
              'Authorization': 'Bearer ' + ACCESS_KEY_SPOTIFY // Make sure access_token is a valid OAuth token
          }
      });
      //let getOneSong = response.data;
      return res.status(200).json(response.data); 
      // return res.status(200).send({
      //     nama_lagu : getOneSong.name,
      //     artis : getOneSong.album.artists[0].name,
      //     url:getOneSong.external_urls.spotify,
      //     complete :getOneSong
      // });
      // Send only the response data using res.json()
      // Handle the response data as needed
    } catch (error) {
        console.error('Error fetching data:', error.response.data);
        return res.status(error.response.status).json({ error: error.response.data }); // Send error response
    }
};

const createPlayList = async function (req, res) {
    console.log(req.body);
    const playlistname = req.body.playlistname;
    const description = req.body.description;
    console.log(req.body.playlistname);
    console.log(req.body.description);
    // const token = req.header; 
    // //const token = req.header("x-auth-token");
    // const decoded = jwt.verify(token, "PROJECTWS");
    // const user = await User.findOne({ where: { user_id: decoded.user_id } });
    // if (!user) {
    //     return res.status(404).json({messege:"User dis"});
    // } 
    const countPlay = await Playlist.count();
    let ids = "";
    if (countPlay > 9) {
        ids = "PL0"+(countPlay+1);
    } else if (countPlay > 99) {
        ids = "PL"+(countPlay+1);
    } else{
        ids = "PL00"+(countPlay+1);
    }
    // const createPlaylist = Playlist.create({
    //     playlist_id : ids,
    //     name:playlistname,
    //     description:description,
    //     user_id : decoded.user_id
    // });
    return res.status(200).json({
        messege : "Playlist successfuly created",
        playlist_id : ids,
        name:playlistname,
        description:description
    });
  };


const deletePlayList = async function (req, res) {
    //console.log(req.params.playlist_id);
    const playlist_id = req.params.playlist_id;
    const token = req.header; 
    // //const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, "PROJECTWS");
    const user = await User.findOne({ where: { user_id: decoded.user_id } });
    if (!user) {
        return res.status(404).json({messege:"User dis"});
    } 
    const SearchTracklist = await Tracklist.findAll({where:{playlist_id:playlist_id,user_id : decoded.user_id}});
    SearchTracklist.delete();
    const SearchPlaylist = await Playlist.findOne({where:{playlist_id:playlist_id,user_id : decoded.user_id}});
    SearchPlaylist.delete();

    return res.status(200).json({
        playlist_name : SearchPlaylist.playlist_name,
        description:description,
        All_Songs_In_PlayList:SearchTracklist
    });
};

// const deleteTrackList = async function (req, res) {
//     console.log(req.params.playlist_id);
//     console.log(req.params.name);
//     const {playlist_id,name} = req.params;
//     // const token = req.header; 
//     // //const token = req.header("x-auth-token");
//     // const decoded = jwt.verify(token, "PROJECTWS");
//     const user = await User.findOne({ where: { user_id: decoded.user_id } });
//     if (!user) {
//         return res.status(404).json({messege:"User dis"});
//     } 
//     const trackDelelete = await Tracklist.findOne({ 
//         where: { 
//             playlist_id: playlist_id, 
//             name: name 
//         } 
//     });
//     trackDelelete.delete().save();
//     return res.status(200).json({
//         trackId : trackDelelete.track_id,
//         name:trackDelelete.name
//     });
// };
const InsertToPlayList = async function (req, res) {
    const playlist_id = req.body.playlist_id;
    const url = req.body.url;
    //const trackId = req.body.trackId;
    if (!url) {
        return res.status(400).json({ error: "URL is missing in the request body" });
    }
    if (!playlist_id) {
        return res.status(400).json({ error: "please insert playlist_id" });
    }
    const trackId = url.split("/").pop(); // Extract the track ID from the URL
    //console.log(trackId); // Output: 6DCZcSspjsKoFjzjrWoCdn
    // return res.status(200).send({messege:trackId}); 
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
              'Authorization': 'Bearer ' + ACCESS_KEY_SPOTIFY // Make sure access_token is a valid OAuth token
          }
      });
      let getOneSong = response.data;
      const countPlay = await Tracklist.count();
        let ids = "";
        if (countPlay > 9) {
            ids = "TL0"+(countPlay+1);
        } else if (countPlay > 99) {
            ids = "TL"+(countPlay+1);
        } else{
            ids = "TL00"+(countPlay+1);
        }
      //return res.status(200).json(response.data); 
      return res.status(200).send({
          Tracklist_id : ids,
          nama_lagu : getOneSong.name,
          artis : getOneSong.album.artists[0].name,
          url:getOneSong.external_urls.spotify,
          playlist_id:playlist_id
          //complete :getOneSong
      });
      // Send only the response data using res.json()
      // Handle the response data as needed
    } catch (error) {
        console.error('Error fetching data:', error.response.data);
        return res.status(error.response.status).json({ error: error.response.data }); // Send error response
    }
};//udh bisa


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
              'Authorization': 'Bearer ' + api_key_spotify // Make sure access_token is a valid OAuth token
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
    getAccessTokenFromSpotify,
    getTrackById,
    getTrackByUrl,
    getAlbumByUrl,
    createPlayList,
    InsertToPlayList,
    deletePlayList,
    // deleteTrackList
  };





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