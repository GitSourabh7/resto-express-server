const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql2");

// Create a MySQL connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "resto",
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Define a route to fetch data from the database
app.get("/menu", (req, res) => {
  // Query the database
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error fetching data from database");
      return;
    }

    // Send the data as JSON
    res.json(results);
  });
});

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
