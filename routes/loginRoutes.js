const express = require("express");
const router = express.Router();
const connectionPool = require("../db");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

// Validation middleware for login data
const validateLogin = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password is required"),
];

router.post("/login", validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse user data from the request body
    const { email, password } = req.body;

    // Use the database connection pool
    const pool = connectionPool.promise();

    // Check if the user with the given email exists in the database
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const user = existingUsers[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Create a JWT token for user authentication
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "your_secret_key_here", // Replace with your secret key
      { expiresIn: "1h" } // Token expiration time (e.g., 1 hour)
    );

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
