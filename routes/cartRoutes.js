// cartRoutes.js (Routes for Cart)
const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware to log responses
router.use((req, res, next) => {
  res.on("finish", () => {
    // Log the response status code and message
    console.log(`Response Status: ${res.statusCode} - ${res.statusMessage}`);
  });
  next();
});

// Define a route to insert a new item into the cart
router.post("/cart/add-to-cart", (req, res) => {
  // Get data from the request body
  const { user_id, product_id, product_name, quantity } = req.body;
  console.log(req.body);

  // Check if all required fields are provided
  if (!user_id || !product_id || !product_name || !quantity) {
    res.status(400).send("All fields are required");
    return;
  }

  // Insert the data into the cart_items table
  const insertQuery =
    "INSERT INTO cart_items (user_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)";
  const values = [user_id, product_id, product_name, quantity];

  db.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error inserting item into the cart");
      return;
    }

    // Send a success response
    res.status(201).send("Item added to cart successfully");
  });
});

module.exports = router;
