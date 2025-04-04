import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: uuidv4(),
    name: '',
    username: '',
    email: '',
    password: '',
    favPlayer: '',
    favClub: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Validate form fields
      if (!form.name || !form.username || !form.email || !form.password) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      // Create user first
      const userResponse = await axios.post(`${BACKEND_URL}/users`, {
        id: form.id,
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      console.log(userResponse.data);

      if (userResponse.status === 201) {
        // Store the ID
        localStorage.setItem('id', form.id);
        localStorage.setItem('user', form.username);
        
        // If favorite player and club are provided, save recommendations
        if (form.favPlayer && form.favClub) {
          try {
            const recommendationResponse = await axios.post(`${BACKEND_URL}/recommendations`, {
              id: uuidv4(),
              userId: form.id,
              favPlayer: form.favPlayer,
              favClub: form.favClub
            });
            
            console.log(recommendationResponse.data);
          } catch (recErr) {
            console.error('Error saving recommendations:', recErr);
            // Continue even if recommendations fail
          }
        }
        
        alert('User created successfully');
        setForm({ id: '', name: '', username: '', email: '', password: '', favPlayer: '', favClub: '' });
        navigate('/home');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
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
          
          <div>
            <label className="block text-white">Favorite Footballer (Optional)</label>
            <input
              type="text"
              name="favPlayer"
              value={form.favPlayer}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
              placeholder="Enter your favorite footballer"
            />
          </div>
          
          <div>
            <label className="block text-white">Favorite Football Club (Optional)</label>
            <input
              type="text"
              name="favClub"
              value={form.favClub}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-blue-500"
              placeholder="Enter your favorite football club"
            />
          </div>

          {error && <p className="text-yellow-300 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-800 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
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
