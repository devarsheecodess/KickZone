import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GooglePayButton from './GooglePayButton';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGooglePay, setShowGooglePay] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const userID = localStorage.getItem('id');
            const response = await axios.get(`${BACKEND_URL}/cart`, { params: { userId: userID } });

            if (response.data && response.data.length > 0) {
                const productDetailsArray = response.data.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }));
                setCartItems(productDetailsArray);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            const confirmDelete = confirm("Are you sure you want to delete this item from your cart?");
            if (!confirmDelete) return;

            const response = await axios.delete(`${BACKEND_URL}/cart`, { params: itemId });
            if (response.status === 200) {
                fetchCartItems();
            }
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#1C1C1F]">
                <div className="text-2xl font-medium text-gray-400 flex items-center gap-2">
                    <div className="w-6 h-6 border-4 border-gray-700 border-t-gray-400 rounded-full animate-spin"></div>
                    Loading Cart
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen fixed top-0 left-0 pt-20">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            
            {/* Content */}
            <div className="relative z-10 px-4 py-8">
                <div className="max-w-4xl mx-auto rounded-2xl bg-[#2A2A30] p-6">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                        <h2 className="text-3xl font-semibold text-white">Your Cart</h2>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-xl">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div 
                                    key={item.productId} 
                                    className="group relative overflow-hidden rounded-lg bg-[#343438] p-4 transition-all duration-300 hover:bg-[#3A3A3E]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-medium text-white">{item.name}</h3>
                                            <div className="flex gap-4 text-sm text-gray-400">
                                                <p>₹{item.price.toFixed(2)}</p>
                                                <span>•</span>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                                            aria-label="Delete item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-xl font-semibold text-white">
                                        Total: ₹{totalPrice.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => setShowGooglePay(true)}
                                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#2A2A30]"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>

                                {showGooglePay && (
                                    <div className="mt-6">
                                        <GooglePayButton totalPrice={totalPrice} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;