import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart items from backend
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cart'); // Backend endpoint to fetch cart items
                setCartItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle remove item from cart
    const handleRemoveItem = async (id) => {
        try {
            // Make a backend call to remove the item from the cart
            await axios.delete(`http://localhost:3000/cart/${id}`); // Assuming DELETE request to remove item
            setCartItems(cartItems.filter(item => item.id !== id));
        } catch (err) {
            console.log("Error removing item:", err);
        }
    };

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
                                <div key={item.id} className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div className="ml-4">
                                            <p className="text-lg font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">Price: ${item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="mr-4">Qty: {item.quantity}</p>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
                            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
