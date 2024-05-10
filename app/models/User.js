const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/config");

class Users extends Model {}
Users.init(
  {
    user_id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    api_key: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    api_hit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    profile_pic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

module.exports = Users;
