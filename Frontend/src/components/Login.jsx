import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, form);
            console.log(response.data);
            const id = response.data.id;
            const username = response.data.username;
            localStorage.setItem('id', id);
            localStorage.setItem('user', username);
            if (response.status === 200) {
                alert('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError('');
        try {
            // Redirect to Google OAuth endpoint
            console.log('Redirecting to Google login...');
            // Add a timeout to show loading state before redirect
            setTimeout(() => {
                window.location.href = `${BACKEND_URL}/auth/google`;
            }, 100);
            // Note: We won't reach the code below due to page redirect
        } catch (error) {
            console.error('Google login error:', error);
            setError('Failed to connect to Google login. Please try again.');
            setIsLoading(false);
        }
    };
    
    // Check for error parameter in URL (from Google auth redirect)
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        if (errorParam) {
            setError('Google authentication failed. Please try again or use email login.');
        }
    }, []);

    return (
        <div className="relative flex items-center justify-center h-screen">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

            {/* Login Box with yellow border glow */}
            <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-sm w-full text-black border-4 border-yellow-600 ">
                <h1 className="text-2xl text-white font-bold mb-6 text-center">Login</h1>

                <form className="space-y-4">
                    <div>
                        <label className="block text-white font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-yellow-300 text-sm mt-2">{error}</p>}
                    <button
                        onClick={(e) => handleSubmit(e)}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-800 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full border rounded-lg px-4 py-2 hover:bg-gray-100 transition duration-200 text font-semibold text-yellow-600 hover:text-black disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <i className="fa-brands fa-google mr-2 text-yellow-600 font-semibold hover:text-black"></i>
                        Sign in with Google
                    </button>

                    <p className="text-center text-white mt-4">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-white font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
