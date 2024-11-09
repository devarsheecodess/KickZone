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
const Orders = require("./Models/Orders");

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
  const { id, name, username, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      id,
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
    res.json({ success: true, id: user.id });
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

// Fetch products by id
app.get('/products-id', async (req, res) => {
  const { id } = req.query;
  try {
    const product = await Product.findOne({ id: id });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add to cart
app.post('/cart', async (req, res) => {
  const { productId, userId, image, name, price } = req.body;

  // Validate required fields
  if (!productId || !userId || !image || !name || price === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if the product is already in the cart for the user
    const exists = await Cart.findOne({ userId, productId });

    if (exists) {
      // If the item exists, increment the quantity
      const updateResult = await Cart.updateOne(
        { userId, productId },
        { $inc: { quantity: 1 } }
      );

      if (updateResult.nModified === 0) {
        return res.status(400).json({ message: "Failed to update quantity" });
      }

      return res.status(200).json({ message: "Quantity updated in cart", updatedCart: exists });
    }

    // If the item doesn't exist in the cart, create a new cart item
    const newCart = new Cart({
      userId,
      productId,
      image,
      name,
      price,
      quantity: 1  // Set initial quantity to 1
    });

    // Save the new cart item to the database
    await newCart.save();
    res.status(201).json({ message: "Item added to cart", cart: newCart });
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get cart items
app.get('/cart', async (req, res) => {
  const { userId } = req.query;
  try {
    const cartItems = await Cart.find({ userId })
      .populate('productId', 'name price'); // Populate product details

    if (cartItems.length > 0) {
      res.status(200).json(cartItems); // Return populated cart items
    } else {
      res.status(404).json([]);
    }
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).json([]);
  }
});

// Delete cart items
app.delete('/cart', async (req, res) => {
  const { id } = req.query;

  try {
    const deleteResult = await Cart.deleteOne({ id: id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Payment integration
app.post('/api/process-payment', (req, res) => {
  const { paymentData } = req.body;

  // Log payment data for now (or process with a payment gateway)
  console.log('Payment Data:', paymentData);

  // Simulate success response
  res.json({ status: 'success', message: 'Payment processed in Test Mode.' });
});

// Add orders
app.post('/orders', (req, res) => {
  const { id, userId, productId, date } = req.body;

  if (!id || !userId || !productId || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newOrder = {
      id,
      userId,
      productId,
      date: new Date(date), // Convert date string to Date object
    };

    orders.push(newOrder);

    // Respond with the created order
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
