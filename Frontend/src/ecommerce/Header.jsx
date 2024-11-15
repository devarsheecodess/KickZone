import React, { useState } from 'react';
import { Menu, X, Store, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop for mobile menu */}
      <div 
        className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      {/* Main header - now with higher z-index */}
      <div className="relative backdrop-blur-sm z-50">
        <div className="text-white p-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">
            <a href="/">KickStore</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white hover:text-yellow-300 transition-colors duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 text-lg font-medium">
            <a href="/home" className="hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
              Back to KickZone
            </a>
            <a href="/store" className="flex items-center gap-2 hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
              <Store className="w-5 h-5" />
              <span>Shop</span>
            </a>
            <a href="/cart" className="flex items-center gap-2 hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-300">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation - Top Sliding Panel with lower z-index */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black border-b border-white/10 shadow-2xl transform transition-all duration-300 ease-out lg:hidden z-40
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="max-h-[70vh] overflow-y-auto pt-16"> {/* Added padding-top to prevent content from being hidden under header */}
          {/* Mobile menu items */}
          <nav className="py-6">
            <div className="px-6 space-y-6">
              <a 
                href="/home" 
                className="flex items-center text-lg text-white/90 hover:text-yellow-300 transition-colors duration-300"
                onClick={toggleMenu}
              >
                <span className="relative group">
                  Back to KickZone
                  <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-300 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </a>
              
              <a 
                href="/store" 
                className="flex items-center gap-3 text-lg text-white/90 hover:text-yellow-300 transition-colors duration-300 group"
                onClick={toggleMenu}
              >
                <Store className="w-5 h-5" />
                <span className="relative">
                  Shop
                  <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-300 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </a>
              
              <a 
                href="/cart" 
                className="flex items-center gap-3 text-lg text-white/90 hover:text-yellow-300 transition-colors duration-300 group"
                onClick={toggleMenu}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="relative">
                  Cart
                  <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-300 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </a>
            </div>
          </nav>

          {/* Decorative elements */}
          <div className="px-6 py-4 bg-gradient-to-r from-black/0 via-white/5 to-black/0">
            <div className="text-sm text-gray-400 text-center">
              © 2024 KickStore
            </div>
          </div>
        </div>

        {/* Bottom fade effect */}
        <div className="h-6 bg-gradient-to-t from-black to-transparent" />
      </div>
    </header>
  );
};

export default Header;