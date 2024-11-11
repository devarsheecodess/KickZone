import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

const MainPage = () => {
  const [tickets, setTickets] = useState([]);
  const [merch, setMerch] = useState([]);
  const [userID, setUserID] = useState('')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/products`, { params: { type: 'ticket' } });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  }

  const fetchMerch = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/products`, { params: { type: 'merch' } });
      setMerch(response.data);
    } catch (err) {
      console.error('Error fetching merch:', err);
    }
  }

  const addToCart = async (productId) => {
    try {
      // Fetch product details
      const productDetailsResponse = await axios.get(`${BACKEND_URL}/products-id`, { params: { id: productId } });
      const productDetails = productDetailsResponse.data;
      console.log(productDetails)

      if (!productDetails) {
        throw new Error("Product not found.");
      }

      // Prepare the cart item data
      const newCartItem = {
        id: uuidv4(),  // Generate a unique ID for the cart item
        productId,     // Pass the productId
        userId: localStorage.getItem('id'), // Retrieve User ID from local storage
        quantity: 1,    // Default quantity
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.image,  // Assuming these fields exist
      };

      console.log(newCartItem);

      // Add the product to the cart in the DB
      const response = await axios.post(`${BACKEND_URL}/cart`, newCartItem);

      if (response.status === 201 || response.status === 200) { // Check for 201 Created
        alert("Product added to the cart!");
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      alert("Failed to add product to cart. Please try again."); // User-friendly error message
    }
  };

  useEffect(() => {
    fetchTickets()
    fetchMerch()
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Full-screen background */}
      <div className="fixed top-0 left-0 w-full h-full z-[-2] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mt-16 px-6 py-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full text-center py-20 px-6 bg-opacity-75 backdrop-blur-md">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to KickStore</h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-6">Your one-stop shop for all football tickets and merchandise.</p>
        </section>

        {/* Featured Products Section */}
        <section className="w-full py-10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Merchandise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example product cards */}
            {merch.map((product) => (
              <div key={product.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20 shadow-md">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold text-gray-200">{product.name}</h3>
                <p className="text-gray-400">Price: ₹{product.price.toFixed(2)}</p>
                <button onClick={() => addToCart(product.id)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Tickets Section */}
        <section className="w-full py-10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((product) => (
              <div key={product.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20 shadow-md">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold text-gray-200">{product.name}</h3>
                <p className="text-gray-400">Price: ₹{product.price.toFixed(2)}</p>
                <button onClick={() => addToCart(product.id)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
