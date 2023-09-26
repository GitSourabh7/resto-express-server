const express = require("express");
const router = express.Router();
const connectionPool = require("../db");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// Validation middleware for login data
const validateLogin = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password is required"),
];

router.post("/login", validateLogin, async (req, res) => {
  try {
    // Log the request object
    console.log("Request Object:", req);

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

    // You can create a JWT token for user authentication here if needed

    // Log the response object
    console.log("Response Object:", res);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
