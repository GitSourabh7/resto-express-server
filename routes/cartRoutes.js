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

// Define a route to remove an item from the cart
router.delete("/cart/remove-from-cart", (req, res) => {
  // Get data from the request body
  const { user_id, product_id } = req.body;

  // Check if all required fields are provided
  if (!user_id || !product_id) {
    res.status(400).send("Both user_id and product_id are required");
    return;
  }

  // Delete the item from the cart_items table based on user_id and product_id
  const deleteQuery =
    "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?";
  const values = [user_id, product_id];

  db.query(deleteQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error removing item from the cart");
      return;
    }

    // Check if any rows were affected (item was found and deleted)
    if (results.affectedRows === 0) {
      res.status(404).send("Item not found in the cart");
      return;
    }

    // Send a success response
    res.status(200).send("Item removed from cart successfully");
  });
});

// Define a route to increase the quantity
router.post("/cart/increase-quantity", (req, res) => {
  const { user_id, product_id } = req.body;

  // Update the quantity in the cart_items table based on user_id and product_id
  const updateQuery =
    "UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
  const values = [user_id, product_id];

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error increasing quantity");
      return;
    }

    res.status(200).send("Quantity increased successfully");
  });
});

// Define a route to decrease the quantity
router.post("/cart/decrease-quantity", (req, res) => {
  const { user_id, product_id } = req.body;

  // Update the quantity in the cart_items table based on user_id and product_id
  const updateQuery =
    "UPDATE cart_items SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?";
  const values = [user_id, product_id];

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Error decreasing quantity");
      return;
    }

    res.status(200).send("Quantity decreased successfully");
  });
});

module.exports = router;
