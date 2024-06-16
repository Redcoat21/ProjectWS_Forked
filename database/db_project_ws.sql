DROP DATABASE IF EXISTS db_project_ws;
CREATE DATABASE db_project_ws;
USE db_project_ws;

CREATE TABLE `users` (
    `user_id` VARCHAR(6) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `balance` INT(11) NOT NULL,
    `api_key` VARCHAR(25) NOT NULL,
    `api_hit` INT(11) NOT NULL,
    `premium` BOOLEAN NOT NULL,
    `profile_pic` VARCHAR(255) NOT NULL,
    `now_playing` VARCHAR(255) NULL
);

CREATE TABLE `playlists` (
    `playlist_id` VARCHAR(5) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `user_id` VARCHAR(6) REFERENCES users(user_id)
);

CREATE TABLE `tracklists` (
    `tracklist_id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `playlist_id` VARCHAR(5) REFERENCES playlists(playlist_id),
    `track_id` VARCHAR(255) NOT NULL
);

CREATE TABLE `favorites` (
    `favorite_id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(6) REFERENCES users(user_id),
    `track_id` VARCHAR(255) NOT NULL
);

INSERT INTO `users` VALUES (
    "USR001",
    "Reynard Kamadjaja",
    "rey",
    "reyk@gmail.com",
    "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
    100000,
    "abcde12345",
    50,
    FALSE,
    "public\\assets\\222117054.jpg",
    ""
);

INSERT INTO `users` VALUES (
    "USR002",
    "Richard Hadiyanto",
    "hadi",
    "richardh@gmail.com",
    "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
    100000,
    "fghij12345",
    50,
    FALSE,
    "public\\assets\\222117055.jpg",
    ""
);

INSERT INTO `users` VALUES (
    "USR003",
    "Yoga Pramana",
    "yogay",
    "nogay@gmail.com",
    "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
    100000,
    "klmno12345",
    50,
    FALSE,
    "public\\assets\\222117068.jpg",
    ""
);

INSERT INTO `users` VALUES (
    "USR004",
    "Yosua Christian",
    "yosua",
    "yosuac@gmail.com",
    "$2a$10$JA/dBIjjSuikAUtRM.UZa.RL6IS9lap7XRwDHXPyyis0go7gW9Yc6",
    100000,
    "pqrst12345",
    50,
    FALSE,
    "public\\assets\\222117069.jpg",
    ""
);

INSERT INTO `playlists` VALUES (
    "PL001",
    "My Playlist",
    "Random music = new Random();",
    "USR003"
);

INSERT INTO `playlists` VALUES (
    "PL002",
    "Praise",
    "My Christian Praise Playlist :)",
    "USR003"
);

INSERT INTO `tracklists` VALUES (
    1,
    "Space Cadet (feat. Gunna)",
    "PL001",
    "1fewSx2d5KIZ04wsooEBOz"
);

INSERT INTO `tracklists` VALUES (
    2,
    "Sky",
    "PL001",
    "29TPjc8wxfz4XMn21O7VsZ"
);

INSERT INTO `tracklists` VALUES (
    3,
    "Lemonade (feat. NAV)",
    "PL001",
    "1p0rEzrK7YtdRZVtiyV7RN"
);

INSERT INTO `tracklists` VALUES (
    4,
    "Glock In My Lap",
    "PL001",
    "6pcywuOeGGWeOQzdUyti6k"
);

INSERT INTO `tracklists` VALUES (
    5,
    "Let Go",
    "PL002",
    "6apFmBCR7iOTwZ1yK8xcDT"
);

INSERT INTO `tracklists` VALUES (
    6,
    "Echo (feat. Tauren Wells)",
    "PL002",
    "6ZhORhQoBD0qndKYvpBTv2"
);

INSERT INTO `favorites` VALUES (
    1,
    "USR003",
    "7Ee6XgP8EHKDhTMYLIndu9"
);

INSERT INTO `favorites` VALUES (
    2,
    "USR003",
    "0gWrMbx6pbdH3n3nsLjE55"
);
