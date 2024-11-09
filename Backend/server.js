const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // for password hashing
const dotenv = require("dotenv");
const app = express();

// CORS
const cors = require("cors");
app.use(cors());

// Models
const User = require("./Models/User"); // Assuming you have a User model
const Product = require("./Models/Product");
const Cart = require("./Models/Cart");

// dotenv config
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json({ limit: "20mb" }));

// MongoDB config
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Home route
app.get("/", (req, res) => {
  res.send("KickZone Server");
});

// Signup
app.post("/users", async (req, res) => {
  const { name, username, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Sign-in
app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare hashed passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Send response with token and user details
    res.json({ success: true });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// ECOMMERCE endpoints

// Add products
app.post("/products", async (req, res) => {
  const { id, name, image, desc, price, qty, type, date } = req.body;

  try {
    const newProduct = new Product({
      id,
      name,
      image,
      desc,
      price,
      qty,
      type,
      date,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch products
app.get("/products", async (req, res) => {
  const { type } = req.query;

  try {
    const products = await Product.find({ type });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
