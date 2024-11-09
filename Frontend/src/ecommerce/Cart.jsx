import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GooglePayButton from './GooglePayButton';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showGooglePay, setShowGooglePay] = useState(false);  // Toggle Google Pay button

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const userID = localStorage.getItem('id');
            console.log(userID); // Log the user ID

            const response = await axios.get('http://localhost:3000/cart', { params: { userId: userID } });

            if (response.data && response.data.length > 0) {
                // Map the response to include product details (name, price, quantity)
                const productDetailsArray = response.data.map(item => {
                    return {
                        productId: item.productId, // Product ID (unique identifier)
                        name: item.name, // Name of the product
                        price: item.price, // Price of the product
                        quantity: item.quantity // Quantity in cart
                    };
                });

                console.log(productDetailsArray);
                setCartItems(productDetailsArray); // Set state with product details
            } else {
                console.log('No cart items found for this user.');
                setCartItems([]);  // Set an empty array if no items are found
            }
        } catch (error) {
            console.error('Error fetching cart items:', error.message || error);
        } finally {
            setLoading(false);  // Ensure loading is set to false after fetch attempt
        }
    };

    const deleteItem = async (itemId) => {
        try {
            const confirmDelete = confirm("Are you sure you want to delete this item from your cart?");
            if (!confirmDelete) {
                return;
            }

            const response = await axios.delete(`http://localhost:3000/cart`, { params: itemId });

            if (response.status === 200) {
                alert("Item deleted successfully!");
                fetchCartItems();
            }
        } catch (err) {
            console.error("Error deleting item:", err.response ? err.response.data : err.message);
            alert("Failed to delete item from cart. Please try again.");
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) {
        return <div>Loading...</div>; // Add a loading state
    }

    return (
        <div className="relative min-h-screen">
            {/* Full-screen background */}
            <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-10">
                <h2 className="text-3xl font-semibold text-center mb-6">Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p>Your cart is empty.</p>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-md rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            {/* Display product name */}
                                            <h1 className="text-lg font-semibold">{item.name}</h1>
                                            {/* Display price */}
                                            <p className="text-gray-500">Price: ₹{item.price.toFixed(2)}</p>
                                            {/* Display quantity */}
                                            <p className="text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { deleteItem(item.id) }}
                                        className='bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200'
                                        aria-label="Delete item"
                                    >
                                        <i className="fas fa-trash-alt"></i> {/* Font Awesome bin icon */}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
                            <button 
                                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                                onClick={() => setShowGooglePay(true)}  // Show Google Pay button on click
                            >
                                Proceed to Checkout
                            </button>
                        </div>

                        {/* Google Pay Button */}
                        {showGooglePay && (
                            <div className="mt-6">
                                <GooglePayButton totalPrice={totalPrice} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
