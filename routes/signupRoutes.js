// signupRoutes.js (Routes for Signup)
const express = require("express");
const router = express.Router();
const connectionPool = require("../db");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// Validation middleware for signup data
const validateSignUp = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/signup", validateSignUp, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse user data from the request body
    const { firstName, lastName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use the database connection pool
    const pool = connectionPool.promise();

    // Check if the email already exists in the database
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email address already in use" });
    }

    // Insert the user data into the MySQL database
    const [result] = await pool.execute(
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword]
    );

    // Check if the user was successfully inserted
    if (result && result.affectedRows === 1) {
      res.status(200).json({ message: "Signup successful" });
    } else {
      res.status(500).json({ message: "Error inserting user" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error during signup" });
  }
});

module.exports = router;
