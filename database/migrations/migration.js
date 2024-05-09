"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.STRING(6),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      api_key: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      api_hit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      premium: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      profile_pic: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    await queryInterface.createTable("playlists", {
      playlist_id: {
        type: Sequelize.STRING(5),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING(6),
        references: {
          model: "users",
          key: "user_id",
        },
      },
    });

    await queryInterface.createTable("tracklists", {
      tracklist_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      playlist_id: {
        type: Sequelize.STRING(5),
        references: {
          model: "playlists",
          key: "playlist_id",
        },
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    await queryInterface.createTable("favorites", {
      favorite_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(6),
        references: {
          model: "users",
          key: "user_id",
        },
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("favorites");
    await queryInterface.dropTable("tracklists");
    await queryInterface.dropTable("playlists");
    await queryInterface.dropTable("users");
  },
};
