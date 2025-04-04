// FavoriteForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const FavoriteForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    userId: '',
    favPlayer: '',
    favClub: ''
  });
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
    
    // Validate form fields
    if (!form.favPlayer || !form.favClub) {
      setError('Please enter both your favorite player and club');
      setIsLoading(false);
      return;
    }
    
    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        setError('User ID not found. Please try logging in again.');
        setIsLoading(false);
        return;
      }
      
      const formData = { ...form, id: uuidv4(), userId: userId };

      const response = await axios.post(`${BACKEND_URL}/recommendations`, formData);
      console.log(response.data);
      if (response.status === 201) {
        alert('Favorites saved successfully');
        setForm({ id: '', userId: '', favPlayer: '', favClub: '' });
        // Don't clear localStorage here as it contains important user data
        // Redirect directly to home page instead of login
        navigate('/home');
      }
    } catch (err) {
      console.error('Error saving favorites:', err);
      setError(err.response?.data?.error || 'Failed to save favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 -z-20 w-full min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4">
      <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-sm w-full text-black border-4 border-yellow-600 ">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white">Favorite Footballer and Team</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Favorite Footballer</label>
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
            <label className="block text-white">Favorite Football Club</label>
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
            {isLoading ? 'Saving...' : 'Save Favorites'}
          </button>
        </form>
      </div>
    </div>

  );
};

export default FavoriteForm;