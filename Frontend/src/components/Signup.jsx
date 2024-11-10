import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users', form);
      console.log(response.data);
      if (response.status === 201) {
        alert('User created successfully');
        setForm({ 'name': '', 'username': '', 'email': '', 'password': '' });
        navigate('/login');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

      {/* Signup Box with yellow border glow */}
      <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-sm w-full text-black border-4 border-yellow-600">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white">Signup</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-white">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="relative">
            <label className="block text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500 pr-10"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 top-5 right-3 flex items-center text-gray-500 mt-1"
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-800 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-center text-white mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
