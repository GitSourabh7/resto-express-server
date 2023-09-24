var mysql = require("mysql2");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "resto",
});

module.exports = connection;
