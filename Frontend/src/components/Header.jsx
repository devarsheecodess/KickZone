import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showFootballMenu, setShowFootballMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-red-600">KickZone</div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/home" className="hover:text-red-600 transition-colors">Home</Link>
            
            {/* Football dropdown */}
            <div className="relative group">
              <button 
                className="hover:text-red-600 transition-colors flex items-center gap-1"
                onClick={() => setShowFootballMenu(!showFootballMenu)}
              >
                Football <span className="text-xs">▼</span>
              </button>
              
              {/* Dropdown menu */}
              {showFootballMenu && (
                <div className="absolute top-full left-0 bg-black border border-gray-700 rounded-lg shadow-lg p-2 z-50">
                  <Link 
                    to="/standings" 
                    className="block px-4 py-2 hover:bg-red-600 hover:text-white rounded transition-colors"
                    onClick={() => setShowFootballMenu(false)}
                  >
                    Standings
                  </Link>
                  <Link 
                    to="/fixtures" 
                    className="block px-4 py-2 hover:bg-red-600 hover:text-white rounded transition-colors"
                    onClick={() => setShowFootballMenu(false)}
                  >
                    Fixtures
                  </Link>
                  <Link 
                    to="/players" 
                    className="block px-4 py-2 hover:bg-red-600 hover:text-white rounded transition-colors"
                    onClick={() => setShowFootballMenu(false)}
                  >
                    Players
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/community" className="hover:text-red-600 transition-colors">Community</Link>
            <Link to="/meet" className="hover:text-red-600 transition-colors">Meet</Link>
            <Link to="/polls" className="hover:text-red-600 transition-colors">Polls</Link>
            <Link to="/quiz" className="hover:text-red-600 transition-colors">Quiz</Link>
            <Link to="/store" className="hover:text-red-600 transition-colors">Shop</Link>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Hi, {username}</span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
