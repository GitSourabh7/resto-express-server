// menuRoutes.js (Routes for Menu)
const express = require("express");
const router = express.Router();
const db = require("../db");

// Define a route to fetch data from the database
router.get("/menu", (req, res) => {
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

module.exports = router;
