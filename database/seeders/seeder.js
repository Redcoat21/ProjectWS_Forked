"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", [
      {
        user_id: "USR001",
        name: "Reynard Kamadjaja",
        username: "rey",
        email: "reyk@gmail.com",
        password:
          "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
        balance: 100000,
        api_key: "abcde12345",
        api_hit: 50,
        premium: false,
        profile_pic: "./public/assets/222117054.jpg",
        now_playing: "",
       
      },
      {
        user_id: "USR002",
        name: "Richard Hadiyanto",
        username: "hadi",
        email: "richardh@gmail.com",
        password:
          "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
        balance: 100000,
        api_key: "fghij12345",
        api_hit: 50,
        premium: false,
        profile_pic: "./public/assets/222117055.jpg",
        now_playing: "",
       
      },
      {
        user_id: "USR003",
        name: "Yoga Pramana",
        username: "yogay",
        email: "nogay@gmail.com",
        password:
          "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
        balance: 100000,
        api_key: "klmno12345",
        api_hit: 50,
        premium: false,
        profile_pic: "./public/assets/222117068.jpg",
        now_playing: "",
       
      },
      {
        user_id: "USR004",
        name: "Yosua Christian",
        username: "yosua",
        email: "yosuac@gmail.com",
        password:
          "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
        balance: 100000,
        api_key: "pqrst12345",
        api_hit: 50,
        premium: false,
        profile_pic: "./public/assets/222117069.jpg",
        now_playing: "",
       
      },
    ]);

    await queryInterface.bulkInsert("playlists", [
      {
        playlist_id: "PL001",
        name: "My Playlist",
        description: "Random music = new Random();",
        user_id: "USR003",
       
      },
      {
        playlist_id: "PL002",
        name: "Praise",
        description: "My Christian Praise Playlist :)",
        user_id: "USR003",
       
      },
    ]);

    await queryInterface.bulkInsert("tracklists", [
      {
        name: "Space Cadet (feat. Gunna)",
        playlist_id: "PL001",
        url: "https://open.spotify.com/track/1fewSx2d5KIZ04wsooEBOz?si=59d61ca37d184eb6",
       
      },
      {
        name: "Sky",
        playlist_id: "PL001",
        url: "https://open.spotify.com/track/29TPjc8wxfz4XMn21O7VsZ?si=c124e727d89a4999",
       
      },
      {
        name: "Lemonade (feat. NAV)",
        playlist_id: "PL001",
        url: "https://open.spotify.com/track/1p0rEzrK7YtdRZVtiyV7RN?si=4cba1b55fa674211",
       
      },
      {
        name: "Glock In My Lap",
        playlist_id: "PL001",
        url: "https://open.spotify.com/track/6pcywuOeGGWeOQzdUyti6k?si=8df7fedc65a54209",
       
      },
      {
        name: "Let Go",
        playlist_id: "PL002",
        url: "https://open.spotify.com/track/6apFmBCR7iOTwZ1yK8xcDT?si=dc66b0d5cfc447bf",
       
      },
      {
        name: "Echo (feat. Tauren Wells)",
        playlist_id: "PL002",
        url: "https://open.spotify.com/track/6ZhORhQoBD0qndKYvpBTv2?si=fd51f798d0d54f3f",
       
      },
    ]);

    await queryInterface.bulkInsert("favorites", [
      {
        user_id: "USR003",
        tracklist_id: "",
        url: "https://open.spotify.com/track/7Ee6XgP8EHKDhTMYLIndu9?si=b35eaffb14de4927",
       
      },
      {
        user_id: "USR003",
        tracklist_id: "",
        url: "https://open.spotify.com/track/0gWrMbx6pbdH3n3nsLjE55?si=39ea590f62f7470f",
       
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("favorites", null, {});
    await queryInterface.bulkDelete("tracklists", null, {});
    await queryInterface.bulkDelete("playlists", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
