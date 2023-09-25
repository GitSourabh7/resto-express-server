// db.js (Database Connection)
const mysql = require("mysql2");

// Create a MySQL connection
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "resto",
});

module.exports = db;
