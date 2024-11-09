import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({'username': '', 'email': '', 'password': ''});

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', form);
            console.log(response.data);
            if (response.status === 200) {
                alert('Login successfull!');
                navigate('/home');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name='username'
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name='email'
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name='password'
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        onClick={(e)=>handleSubmit(e)}
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        className="flex items-center justify-center w-full border rounded-lg px-4 py-2 hover:bg-gray-100 transition duration-200"
                        >
                        <i class="fa-brands fa-google mr-2"></i>
                        Sign in with Google
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-indigo-500 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
