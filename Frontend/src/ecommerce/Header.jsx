import React from 'react';
import { FaShoppingCart, FaStore } from 'react-icons/fa'; // Import FontAwesome icons

const Header = () => {
  return (
    <header className="text-white p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">
        <a href="/">KickStore</a>
      </div>

      {/* Navigation Links with FontAwesome Icons */}
      <nav className="flex gap-6 text-lg font-medium">
        <a href="/home" className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
          Back to KickZone
        </a>
        <a href="/store" className="flex items-center gap-2 hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
          <FaStore className="text-xl" /> {/* Store Icon */}
          <span>Shop</span>
        </a>
        <a href="/cart" className="flex items-center gap-2 hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
          <FaShoppingCart className="text-xl" /> {/* Cart Icon */}
          <span>Cart</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
