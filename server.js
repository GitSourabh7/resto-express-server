const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const db = require("./connection");

// Use the cors middleware with default options
app.use(cors());

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL Resto database");
});

// Define a route to fetch data from the database
app.get("/menu", (req, res) => {
  // Query the database
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error fetching menus from menu");
      return;
    }

    // Send the data as JSON
    res.json(results);
  });
});

// Define a route to fetch data from the database
app.get("/category", (req, res) => {
  // Query the database
  db.query("SELECT * FROM category", (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error fetching categories from category");
      return;
    }

    results.unshift({ category: "all" });
    const result = results.map((item) => item.category);

    // Send the data as JSON
    res.json(result);
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
