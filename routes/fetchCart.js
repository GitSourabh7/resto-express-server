const express = require("express");
const router = express.Router();
const connectionPool = require("../db"); // Replace with your database connection module

// Middleware to log the incoming request
router.use("/cart", (req, res, next) => {
  console.log("Incoming Request:", req.method, req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Request Body:", req.body);
  next(); // Continue to the next middleware or route handler
});

// Route to fetch product_ids for the logged-in user's cart
router.get("/cart", async (req, res) => {
  try {
    const userId = req.header("X-User-ID"); // Get the user ID from the header
    console.log(userId);

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in the header" });
    }

    // Use the database connection pool
    const pool = connectionPool.promise();

    // Query to fetch product_ids for the user with the given userId
    const [cartItems] = await pool.execute(
      "SELECT product_id FROM cart_items WHERE user_id = ?",
      [userId]
    );

    // Extract product_ids from the result
    const productIds = cartItems.map((item) => item.product_id);

    // Now, you can fetch data from the 'menu' table using the product_ids
    const [menuItems] = await pool.query("SELECT * FROM menu WHERE id IN (?)", [
      productIds,
    ]);

    res.status(200).json({ menuItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

// Middleware to log the outgoing response
router.use("/cart", (req, res, next) => {
  console.log("Outgoing Response:", res.statusCode);
  console.log("Response Body:", res.body);
  next(); // Continue to the next middleware or route handler
});

module.exports = router;
