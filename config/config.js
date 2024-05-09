const Sequelize = require("sequelize");
const path = require("path");
const db = new Sequelize("", "root", "", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
  logging: false,
});

// init kalau belum ada db nya
db.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_project_ws'")
  .then(([results]) => {
    if (results.length === 0) {
      db.query('CREATE DATABASE db_project_ws')
        .then(() => {
          console.log('Database created successfully');
          db.close();
        })
        .catch(err => {
          console.error('Error creating database:', err);
          db.close();
        });
    } else {
      console.log('Database already exists');
      db.close();
    }
  })
  .catch(err => {
    console.error('Error checking if database exists:', err);
    db.close();
  });



const sequelize = new Sequelize("db_project_ws", "root", "", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;

