const { Model, Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/config");

class Tracklists extends Model {}
Tracklists.init(
  {
    tracklist_id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    playlist_id: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    track_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tracklists",
    tableName: "tracklists",
    timestamps: false,
  }
);
//     `tracklist_id` INT(11) PRIMARY KEY AUTO_INCREMENT,
//     `name` VARCHAR(255) NOT NULL,
//     `playlist_id` VARCHAR(5) REFERENCES playlists(playlist_id),
//     `url` VARCHAR(255) NOT NULL
// );
module.exports = Tracklists;
