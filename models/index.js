"use strict";

var sequelize;

var env = process.env.NODE_ENV || 'development';
var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var pg = require('pg');


sequelize = new Sequelize('instafeed', 'eddie', 'password', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }

  // SQLite only
  //storage: 'path/to/database.sqlite'
});

// if (env === 'production'){
//   sequelize = new Sequelize(process.env.DATABASE_URL, {
//     'dialect': 'postgres'
//   });
// } else {
  //sequelize = new Sequelize(null, null, null,{dialect: 'sqlite', storage: 'instafeed.db'});
// }

// sequelize = new Sequelize('database', 'root', 'password', {
//   host: 'localhost',
//   dialect: 'mysql',
//
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   },
//
//   // SQLite only
//   //storage: 'database.sqlite'
// });
//
// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//   });

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
