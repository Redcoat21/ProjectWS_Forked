const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/config");

class Favorite extends Model {}

Favorite.init(
  {
    favorite_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    track_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: false,
  }
);

module.exports = Favorite;
