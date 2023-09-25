// app.js (Main Application)
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const signupRoutes = require("./routes/signupRoutes");

const db = require("./db");

// Use the cors middleware with default options
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the MySQL database
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL Resto database");

  // Release the connection to the pool when done using it
  connection.release();
});

// Use the route files
app.use("/", menuRoutes);
app.use("/", categoryRoutes);
app.use("/", signupRoutes);

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
