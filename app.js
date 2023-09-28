const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const cartRoutes = require("./routes/cartRoutes");

const db = require("./db");

// Use the cors middleware with default options
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to the MySQL database
async function connectToDatabase() {
  try {
    await db.promise().query("SELECT 1");
    console.log("Connected to MySQL Resto database");
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    process.exit(1); // Exit the application on database connection failure
  }
}

// Initialize the database connection
connectToDatabase();

// Use the route files
app.use("/", menuRoutes);
app.use("/", categoryRoutes);
app.use("/", signupRoutes);
app.use("/", loginRoutes);
app.use("/", cartRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
