const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define("User", {
  user_id: {
    type: Sequelize.STRING(6),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING(25),
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  api_key: {
    type: Sequelize.STRING(25),
    allowNull: false,
    unique: true,
  },
  api_hit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  premium: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = User;
