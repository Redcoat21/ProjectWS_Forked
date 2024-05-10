const { Model, Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/config");


class Playlists extends Model {}
Playlists.init( 
{
  playlist_id: {
    type: Sequelize.STRING(5),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  user_id: {
    type: Sequelize.STRING(6),
    allowNull: false,
  },
},{
  sequelize,
  modelName: "Playlists",
  tableName: "playlists",
  timestamps: false,
});
// CREATE TABLE `playlists` (
//   `playlist_id` VARCHAR(5) PRIMARY KEY,
//   `name` VARCHAR(255) NOT NULL,
//   `description` VARCHAR(255) NULL,
//   `user_id` VARCHAR(6) REFERENCES users(user_id)
// );
module.exports = Playlists;
