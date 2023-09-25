// categoryRoutes.js (Routes for Categories)
const express = require("express");
const router = express.Router();
const db = require("../db");

// Define a route to fetch data from the database
router.get("/category", (req, res) => {
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

module.exports = router;
